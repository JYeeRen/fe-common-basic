import { makeAutoObservable, runInAction } from "mobx";
import {
  CustomTemplateCol,
  CustomTemplateFormValues,
  CustomsTemplate,
} from "./types";
import optionsService from "@services/options.service";
import { v4 as uuidv4 } from "uuid";
import { loading, net } from "@infra";
import { isEqual, keyBy, uniqBy } from "lodash";
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

  handleColumnRemove(key: string) {
    this.templateColumns = this.templateColumns.filter((col) => col.key !== key);
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
      },
    ];
  }

  handleRecordFieldChange<K extends keyof CustomTemplateCol>(
    key: K,
    value: CustomTemplateCol[K],
    record: CustomTemplateCol
  ) {
    const newCols = this.templateColumns.map((item) => {
      if (item.key === record.key) {
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
    this.templateColumns = this.formatTemplateColsFromServer(this.customTemplate?.columns ?? []);
  }

  handleColumnSelected(keys: string[]) {
    const cols = this.templateColumns.filter(
      (col) => !this.templateColumnDict[col.key] || keys.includes(col.key)
    );
    const newColumns = keys.map((key) => this.templateColumnDict[key]);
    const templateColumns = uniqBy([...cols, ...newColumns], "key");
    this.templateColumns = templateColumns;
    this.closeColumnSelectModal();
  }

  get columnKeys() {
    return this.templateColumns
      .map((col) => col.key)
      .filter((key) => this.templateColumnDict[key]);
  }

  get templateColumnDict() {
    return keyBy(this.templateColumnOptions, "key");
  }

  get templateTypes() {
    return optionsService.get("customTemplateTypes");
  }

  get templateColumnOptions() {
    return optionsService.templateColumns;
  }

  get initialValues(): CustomTemplateFormValues {
    return {
      name: "",
      type: 0,
      active: true,
      mergeOrderNumber: false,
      columns: [],
      ...(this.customTemplate ?? {}),
    };
  }

  @loading()
  async createTemplate(formvalues: CustomTemplateFormValues) {
    await net.post("/api/customsTemplate/create", {
      ...formvalues,
      columns: this.columns,
    });
  }

  @loading()
  async updateTemplate(formvalues: CustomTemplateFormValues) {
    await net.post("/api/customsTemplate/edit", {
      id: this.id,
      ...formvalues,
      columns: this.columns,
    });
  }

  formatTemplateColsFromServer(cols: Schema.CustomTemplateCol[]) {
    return cols.map((col) => ({
      ...col,
      interceptBefore: Boolean(
        col.interceptBeforeStart || col.interceptBeforeEnd
      ),
      interceptAfter: Boolean(
        col.interceptAfterStart || col.interceptAfterEnd
      ),
    }));
  }

  @loading()
  async loadTemplate(id: number) {
    const template = await net.post("/api/customsTemplate/getInfo", { id });
    runInAction(() => {
      this.customTemplate = template;
      this.templateColumns = this.formatTemplateColsFromServer(template.columns);
    });
  }

  isFieldChanged(formValues: CustomTemplateFormValues) {
    if (!this.id) {
      return false;
    }
    const {
      name,
      type,
      active,
      mergeOrderNumber
    } = this.initialValues;
    if (!isEqual(formValues, {
      name,
      type,
      active,
      mergeOrderNumber
    })) {
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
    }));
  }
}
