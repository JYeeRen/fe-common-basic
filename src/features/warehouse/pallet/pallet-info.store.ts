import {ClientGridStore} from "@components";
import {makeAutoObservable, reaction} from "mobx";
import {PalletInfo} from "@features/warehouse/pallet/type.ts";
import {loading, net} from "@infra";

export class PalletInfoStore {
    loading = false;

    addModelVisible = false;

    gridStore: ClientGridStore<PalletInfo>;

    selectedRowKeys: number[] = [];

    constructor(_options: unknown, gridStore: ClientGridStore<PalletInfo>) {
        makeAutoObservable(this);
        this.gridStore = gridStore;

        reaction(
            () => this.gridStore.rowData,
            () => {
                this.setSelectedRowKeys([]);
            }
        );
    }

    get selectedRows() {
        return this.gridStore.rowData.filter(r => this.selectedRowKeys.includes(r.id));
    }

    setSelectedRowKeys(keys: number[]) {
        this.selectedRowKeys = keys;
    }

    showAddModal() {
        this.addModelVisible = true;
    }

    hideAddModal() {
        this.addModelVisible = false;
    }

    @loading()
    async addPallets(formData: { date: string, count: number }) {
        return await net.post("/api/warehouse/pallet/create", formData);
    }

    @loading()
    async printPallets(ids: number[]) {
        const {url} = await net.post("/api/warehouse/pallet/downloadCodes", {ids});
        const newWindow = window.open('', "_blank");
        if (newWindow) {
            newWindow.document.write(`
      <html>
      <head>
        <title>Print PDF</title>
        <style>
          body {
            margin: 0;
          }
          canvas {
            display: block;
            page-break-after: always;
            page-break-inside: avoid;
          }
        </style>
        <script src="${window.location.origin}/pdf/pdf.min.js"></script>
      </head>
      <body>
        <div id="pdfContainer"></div>
        <script>
          var pdfjsLib = window['pdfjs-dist/build/pdf'];
          pdfjsLib.getDocument('${url}').promise.then(function(pdf) {
            var container = document.getElementById('pdfContainer');
            var totalPages = pdf.numPages;
            var renderedPages = 0;

            for (var pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
              pdf.getPage(pageNumber).then(function(page) {
                // 计算缩放比例以使PDF内容占满窗口
                var scale = Math.min(window.innerWidth / page.getViewport({ scale: 1 }).width, window.innerHeight / page.getViewport({ scale: 1 }).height);
                var viewport = page.getViewport({ scale: scale });
                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                container.appendChild(canvas);

                var renderContext = {
                  canvasContext: context,
                  viewport: viewport
                };

                page.render(renderContext).promise.then(function() {
                  renderedPages++;
                  if (renderedPages === totalPages) {
                    window.print();
                  }
                });
              });
            }
          });
        </script>
      </body>
    </html>
    `);
            newWindow.document.close();
        }
    }
}