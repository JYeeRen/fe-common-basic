import { makeAutoObservable, runInAction } from "mobx";
import {
  CustomTemplateCol,
  CustomTemplateFormValues,
  CustomsTemplate,
} from "./types";
import optionsService from "@services/options.service";
import { v4 as uuidv4 } from "uuid";
import { loading, net } from "@infra";
import { isEqual, keyBy, uniq } from "lodash";
import { Schema } from "@types";

export class CustomTemplateOperationStore {
  templateColumns: CustomTemplateCol[] = [];
  loading = false;

  id = 0;
  customTemplate?: CustomsTemplate = undefined;
  isColumnSelectModalOpen = false;

  constructor() {
    makeAutoObservable(this);
  }

  closeColumnSelectModal() {
    this.isColumnSelectModalOpen = false;
  }

  openColumnSelectModal() {
    this.isColumnSelectModalOpen = true;
  }

  handleColumnRemove(uuid: string) {
    this.templateColumns = this.templateColumns.filter(
      (col) => col.uuid !== uuid
    );
  }

  handleColumnCopy(uuid: string) {
    const targetIdx = this.templateColumns.findIndex(
      (col) => col.uuid === uuid
    );
    if (targetIdx === -1) {
      return;
    }
    this.templateColumns = [
      ...this.templateColumns.slice(0, targetIdx),
      { ...this.templateColumns[targetIdx], uuid: uuidv4() },
      ...this.templateColumns.slice(targetIdx),
    ].map((col, index) => ({ ...col, index }));
  }

  @loading()
  async onLoad(id = 0) {
    this.id = id;
    if (this.id) {
      await this.loadTemplate(id);
    }
  }

  @loading()
  async handleSubmit(formVlaues: CustomTemplateFormValues) {
    if (this.id) {
      await this.updateTemplate(formVlaues);
      return;
    }
    await this.createTemplate(formVlaues);
  }

  addCustomTemplateColumns() {
    this.templateColumns = [
      ...this.templateColumns,
      {
        uuid: uuidv4(),
        type: "custom",
        key: uuidv4(),
        index: this.templateColumns.length,
        cnName: "",
        enName: "",
        exportName: "",
        fixedValue: "",
        interceptBeforeStart: undefined,
        interceptBeforeEnd: undefined,
        interceptAfterStart: undefined,
        interceptAfterEnd: undefined,
        targetUnit: "",
        mergence: false,
        selectUnit: false
      },
    ];
  }

  handleRecordFieldChange<K extends keyof CustomTemplateCol>(
    key: K,
    value: CustomTemplateCol[K],
    record: CustomTemplateCol
  ) {
    const newCols = this.templateColumns.map((item) => {
      if (item.uuid === record.uuid) {
        return { ...item, [key]: value };
      }
      return item;
    });
    this.templateColumns = newCols;
  }

  setTemplateColumns(cols: CustomTemplateCol[]) {
    this.templateColumns = [...cols];
  }

  resetTemplateColumns() {
    this.templateColumns = this.formatTemplateColsFromServer(
      this.customTemplate?.columns ?? []
    ).map((col) => ({ ...col, uuid: uuidv4() }));
  }

  handleColumnSelected(keys: string[]) {
    const cols = this.templateColumns.filter(
      (col) => !this.templateColumnDict[col.key] || keys.includes(col.key)
    );
    const curColDict = keyBy(cols, "key");
    const templateColumns = [...cols];
    keys.forEach((k) => {
      if (!curColDict[k]) {
        const { isMerge, amountUnits = [], ...target } = this.templateColumnDict[k];
        templateColumns.push({
          ...target,
          mergence: isMerge ?? false,
          selectUnit: amountUnits.length > 0,
          uuid: uuidv4(),
        });
      }
    });
    this.templateColumns = templateColumns;
    this.closeColumnSelectModal();
  }

  get columnKeys() {
    return uniq(
      this.templateColumns
        .map((col) => col.key)
        .filter((key) => this.templateColumnDict[key])
    );
  }

  get templateColumnDict() {
    return keyBy(this.templateColumnOptions, "key");
  }

  get templateTypes() {
    return optionsService.customTemplateTypes;
  }

  get templateColumnOptions() {
    return optionsService.templateColumns;
  }

  get initialValues(): Partial<CustomTemplateFormValues> {
    return {
      name: "",
      type: 1,
      active: true,
      mergeOrderNumber: false,
      columns: [],
      // typesetting: 1,
      ...this.customTemplate,
    };
  }

  @loading()
  async createTemplate(formvalues: CustomTemplateFormValues) {
    await net.post("/api/customsTemplate/create", {
      ...formvalues,
      columns: this.columns.map(col => ({
        ...col,
        isMerge: formvalues.typesetting !== 2 ? false : col.isMerge,
      })),
    });
  }

  @loading()
  async updateTemplate(formvalues: CustomTemplateFormValues) {
    await net.post("/api/customsTemplate/edit", {
      id: this.id,
      ...formvalues,
      columns: this.columns.map(col => ({
        ...col,
        isMerge: formvalues.typesetting !== 2 ? false : col.isMerge,
      })),
    });
  }

  formatTemplateColsFromServer(cols: Schema.CustomTemplateCol[]) {
    return cols.map((col) => {
      const target = this.templateColumnDict[col.key];
      return {
        uuid: uuidv4(),
        ...col,
        interceptBefore: Boolean(
          col.interceptBeforeStart || col.interceptBeforeEnd
        ),
        interceptAfter: Boolean(col.interceptAfterStart || col.interceptAfterEnd),
        mergence: target?.isMerge ?? false,
        selectUnit: (target?.amountUnits ?? []).length > 0
      };
    });
  }

  @loading()
  async loadTemplate(id: number) {
    const template = await net.post("/api/customsTemplate/getInfo", { id });
    runInAction(() => {
      this.customTemplate = template;
      this.templateColumns = this.formatTemplateColsFromServer(
        template.columns
      );
    });
  }

  isFieldChanged(formValues: CustomTemplateFormValues) {
    if (!this.id) {
      return false;
    }
    const { name, type, active, mergeOrderNumber, typesetting } = this.initialValues;
    if (
      !isEqual(formValues, {
        name,
        type,
        active,
        mergeOrderNumber,
        typesetting,
      })
    ) {
      return true;
    }

    return !isEqual(this.customTemplate?.columns, this.columns);
  }

  get changeNotSave() {
    return true;
  }

  get columns(): Schema.CustomTemplateCol[] {
    return this.templateColumns.map((col, index) => ({
      index,
      key: col.key,
      cnName: col.cnName || "",
      enName: col.enName || "",
      exportName: col.exportName || "",
      fixedValue: col.fixedValue || "",
      interceptBeforeStart: col.interceptBeforeStart || 0,
      interceptBeforeEnd: col.interceptBeforeEnd || 0,
      interceptAfterStart: col.interceptAfterStart || 0,
      interceptAfterEnd: col.interceptAfterEnd || 0,
      targetUnit: col.targetUnit || "",
      isMerge: col.isMerge,
      amountUnit: col.amountUnit || "",
    }));
  }
}
