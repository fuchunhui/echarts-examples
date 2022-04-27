import { store } from '../common/store';
import { URL_PARAMS, SCRIPT_URLS } from '../common/config';
import { downloadBlob } from '../common/helper';

export function download() {
  const hasRootPath = store.sourceCode.indexOf('ROOT_PATH') >= 0;
  const rootPathCode = hasRootPath ? `var ROOT_PATH = '${store.cdnRoot}';` : '';

  const hasJQueryJS = store.sourceCode.indexOf('$.get') >= 0;
  const jqueryScriptCode = hasJQueryJS
    ? '<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/jquery"></script>'
    : '';

  const echartsDir = SCRIPT_URLS.echartsDir.replace(
    '{{version}}',
    store.echartsVersion
  );
  const echarts4Dir = SCRIPT_URLS.echartsDir.replace('{{version}}', '4.9.0');
  const code = `<!--
  THIS EXAMPLE WAS DOWNLOADED FROM ${window.location.href}
-->
<!DOCTYPE html>
<html style="height: 100%">
<head>
  <meta charset="utf-8">
</head>
<body style="height: 100%; margin: 0">
  <div id="container" style="height: 100%"></div>

  ${jqueryScriptCode}
  <script type="text/javascript" src="${echartsDir}${SCRIPT_URLS.echartsMinJS}"></script>
  <!-- Uncomment this line if you want to dataTool extension
  <script type="text/javascript" src="${echartsDir}/dist/extension/dataTool.min.js"></script>
  -->
  <!-- Uncomment this line if you want to use gl extension
  <script type="text/javascript" src="${SCRIPT_URLS.echartsGLMinJS}"></script>
  -->
  <!-- Uncomment this line if you want to echarts-stat extension
  <script type="text/javascript" src="${SCRIPT_URLS.echartsStatMinJS}"></script>
  -->
  <!-- Uncomment this line if you want to use map
  <script type="text/javascript" src="${echarts4Dir}/map/js/china.js"></script>
  <script type="text/javascript" src="${echarts4Dir}/map/js/world.js"></script>
  -->
  <!-- Uncomment these two lines if you want to use bmap extension
  <script type="text/javascript" src="https://api.map.baidu.com/api?v=2.0&ak=<Your Key Here>"></script>
  <script type="text/javascript" src="${echartsDir}/dist/extension/bmap.min.js"></script>
  -->

  <script type="text/javascript">
    var dom = document.getElementById('container');
    var myChart = echarts.init(dom, null, {
      renderer: '${store.renderer}',
      useDirtyRect: ${store.useDirtyRect}
    });
    var app = {};
    ${rootPathCode}
    var option;

    ${store.sourceCode}

    if (option && typeof option === 'object') {
      myChart.setOption(option);
    }

    window.addEventListener('resize', myChart.resize);
  </script>
</body>
</html>`;
  const file = new Blob([code], {
    type: 'text/html;charset=UTF-8',
    encoding: 'UTF-8'
  });
  // download the blob
  downloadBlob(file, (URL_PARAMS.c || Date.now()) + '.html');
}
