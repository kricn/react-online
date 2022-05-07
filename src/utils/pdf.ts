import html2Canvas from 'html2canvas';
import JsPDF from 'jspdf';

/**
 * 通过页面节点生成`PDF`
 * @param {HTMLElement} el 当前截图的节点
 * @param {string} title 生成的`pdf`标题
 * @param {boolean} nextPage 是否分页，默认`false`
 * @param {number} padding 两边留白
 */
export function createPdfByElement(el: HTMLElement, title: string, nextPage?: boolean, padding?: number) {
  
  const _padding: number = padding || 0

  html2Canvas(el, {
    allowTaint: true,
    scale: window.devicePixelRatio < 3 ? window.devicePixelRatio : 2
  }).then(function (canvas) {
    const contentWidth = canvas.width;
    const contentHeight = canvas.height;
    const pageHeight = contentWidth / 592.28 * 841.89;
    let leftHeight = contentHeight;
    let position = 0;
    const imgWidth = 595.28;
    const imgHeight = 592.28 / contentWidth * contentHeight;
    const base64 = canvas.toDataURL('image/jpeg', 1.0);
    /**
     * 添加img标签查看效果
     */
    const img = document.createElement("img")
    img.src = base64
    el.appendChild(img)
    //方向默认竖直，尺寸ponits，格式a4【595.28,841.89]
    const pdf = !nextPage ? new JsPDF('landscape', 'pt', [imgWidth + _padding * 2, imgHeight + _padding * 2]) : new JsPDF('landscape', 'pt', 'a4');
    if (!nextPage) {
      pdf.addImage(base64, _padding, _padding, imgWidth, imgHeight);
    } else {
      // 分页的情况 计算下一页
      if (leftHeight < pageHeight) {
        pdf.addImage(base64, 'jpeg', 0, 0, imgWidth, imgHeight);
      } else {
        while (leftHeight > 0) {
          pdf.addImage(base64, 'jpeg', 0, position, imgWidth, imgHeight);
          leftHeight -= pageHeight;
          position -= 841.89;
          if (leftHeight > 0) {
            pdf.addPage();
          }
        }
      }
    }
    pdf.save(title + '.pdf');
  });
}
