document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const projectName = urlParams.get("p");
  if (!projectName)
    return null;

  const desktopWidth = Number(urlParams.get("desktop")) || 1440;
  const mobileWidth = Number(urlParams.get("mobile")) || 675;

  const iframe = document.getElementById("project-viewer");

  let setIframeHeight = function () {
    const heightFix = 30;
    iframe.height = iframe.contentWindow.document.body.scrollHeight + heightFix;
  };

  iframe.src = `projects/${projectName}/index.html`;
  iframe.onload = setIframeHeight;

  const btnMobile = document.getElementById("btn-mobile");
  const btnDesktop = document.getElementById("btn-desktop");

  // Initial isMobile and isAllowSwitch modes depends of initial window width:
  const widthFix = 20;
  let isMobile = document.body.clientWidth <= mobileWidth + widthFix;
  let isAllowSwitch = !isMobile;

  let setIframeWidth = function () {
    if (isAllowSwitch) {
      if (isMobile) {
        btnMobile.classList.add("hidden");
        btnDesktop.classList.remove("hidden");
        iframe.width = mobileWidth;
      } else {
        btnMobile.classList.remove("hidden");
        btnDesktop.classList.add("hidden");
        iframe.width = desktopWidth;
      }
    } else {
      btnMobile.classList.add("hidden");
      btnDesktop.classList.add("hidden");
      iframe.width = mobileWidth;
    }
  };
  setIframeWidth();

  let setMode = function (isMobileNewValue) {
    if (isMobile !== isMobileNewValue) {
      isMobile = isMobileNewValue;
      setIframeWidth();
      setIframeHeight();
    }
  };

  btnMobile.onclick = function () {
    setMode(true);
  };
  btnDesktop.onclick = function () {
    setMode(false);
  };

  let setAllowSwitch = function (isAllowSwitchNewValue) {
    if (isAllowSwitch !== isAllowSwitchNewValue) {
      isAllowSwitch = isAllowSwitchNewValue;
      setIframeWidth();
      setIframeHeight();
    }
  };

  window.onresize = function () {
    setAllowSwitch(document.body.clientWidth > mobileWidth + widthFix);
  };
});
