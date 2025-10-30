"use strict";
self["webpackHotUpdatedocs"]('main', {
"./src/components/App.jsx": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": () => (__WEBPACK_DEFAULT_EXPORT__)
});
/* ESM import */var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/react/jsx-dev-runtime.js");
/* ESM import */var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/react/index.js");
/* ESM import */var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* ESM import */var cozy_external_bridge_container__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/cozy-external-bridge/dist/container/index.js");
/* ESM import */var cozy_flags__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/cozy-flags/dist/index.browser.js");
/* ESM import */var _styles_iframes_styl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/styles/iframes.styl");
/* ESM import */var react_router_dom__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/react-router/dist/index.js");
/* ESM import */var cozy_client__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./node_modules/cozy-client/dist/index.js");
/* ESM import */var cozy_client__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(cozy_client__WEBPACK_IMPORTED_MODULE_7__);
/* ESM import */var cozy_bar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/cozy-bar/dist/index.js");
/* ESM import */var cozy_sharing__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("./node_modules/cozy-sharing/dist/components/ShareModal/ShareModal.js");
/* ESM import */var cozy_ui_transpiled_react_Buttons__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./node_modules/cozy-ui/transpiled/react/Buttons/index.js");
/* ESM import */var cozy_ui_transpiled_react_Icon__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("./node_modules/cozy-ui/transpiled/react/Icon/index.js");
/* ESM import */var cozy_ui_transpiled_react_Icons_Plus__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("./node_modules/cozy-ui/transpiled/react/Icons/Plus.js");
/* ESM import */var cozy_ui_transpiled_react_Icons_Burger__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("./node_modules/cozy-ui/transpiled/react/Icons/Burger.js");
/* ESM import */var cozy_ui_transpiled_react_providers_Breakpoints__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./node_modules/cozy-ui/transpiled/react/providers/Breakpoints/index.js");
/* ESM import */var cozy_ui_transpiled_react_Typography__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("./node_modules/cozy-ui/transpiled/react/Typography/index.js");
/* ESM import */var cozy_ui_transpiled_react_BarTitle__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("./node_modules/cozy-ui/transpiled/react/BarTitle/index.js");
/* ESM import */var cozy_ui_transpiled_react_Progress__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("./node_modules/@material-ui/core/esm/CircularProgress/CircularProgress.js");

















const App = ()=>{
    const { pathname } = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_6__.useLocation)();
    const client = (0,cozy_client__WEBPACK_IMPORTED_MODULE_7__.useClient)();
    const { isMobile } = (0,cozy_ui_transpiled_react_providers_Breakpoints__WEBPACK_IMPORTED_MODULE_8__["default"])();
    // State to manage share modal visibility
    const [shareModalOpen, setShareModalOpen] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    // State to manage drive panel visibility (desktop / mobile)
    const [driveOpen, setDriveOpen] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    // Getting the currently opened file based on the URL
    const externalId = pathname.includes('/bridge/docs/') ? pathname.replace('/bridge/docs/', '').replace('/', '') : null;
    const { data: files } = (0,cozy_client__WEBPACK_IMPORTED_MODULE_7__.useQuery)((0,cozy_client__WEBPACK_IMPORTED_MODULE_7__.Q)('io.cozy.files').where({
        'metadata.externalId': externalId
    }).indexFields([
        'metadata.externalId'
    ]).limitBy(1), {
        as: `io.cozy.files/${externalId}`
    });
    // State containing the currently opened file
    const currentlyOpenedFile = files && files.length > 0 ? files[0] : null;
    // Get IFrame URL from external flag
    const embeddedDocsUrl = (0,cozy_flags__WEBPACK_IMPORTED_MODULE_3__["default"])('docs.embedded-app-url');
    const { isReady, urlToLoad } = (0,cozy_external_bridge_container__WEBPACK_IMPORTED_MODULE_2__.useExternalBridge)(embeddedDocsUrl);
    // Getting drive controller URL
    const isHTTPS = window.location.protocol === 'https:';
    const driveURL = window.location.origin.replace("docs", "drive");
    const [controllerAppUrl, setControllerAppUrl] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(driveURL);
    const [controllerHasLoaded, setControllerHasLoaded] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [embeddedAppHasLoaded, setEmbeddedAppHasLoaded] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    // Réfs to interact with iframes
    const controllerApp = react__WEBPACK_IMPORTED_MODULE_1___default().useRef(null);
    const embeddedApp = react__WEBPACK_IMPORTED_MODULE_1___default().useRef(null);
    // Synchronize opened file with controller app (opens in the right folder)
    const updateOpenedFileInController = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(()=>{
        if (!currentlyOpenedFile) return;
        if (!controllerApp.current) return;
        const directory = currentlyOpenedFile.dir_id;
        controllerApp.current.contentWindow.postMessage('openFolder:' + directory, '*');
        controllerApp.current.contentWindow.postMessage('selectedFile:' + currentlyOpenedFile.id, '*');
    }, [
        currentlyOpenedFile
    ]);
    // Call synchronization when loaded and on file change (if link opened from Iframe)
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        updateOpenedFileInController();
    }, [
        currentlyOpenedFile,
        controllerHasLoaded
    ]);
    // Intercept messages from both iframes
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        window.onmessage = function(e) {
            if (e.data == undefined || e.data == null || typeof e.data !== "string") return;
            // CONTROLLER : Has loaded
            if (e.data === "loaded") {
                // Save loaded state
                if (!controllerHasLoaded) {
                    setControllerHasLoaded(true);
                }
                // Inform controller that we are in shell (to enable shell specific features)
                if (!controllerApp.current) return;
                controllerApp.current.contentWindow.postMessage('inShell:true', '*');
                // Sync opened file in controller
                updateOpenedFileInController();
            }
            // EMBEDDED : Has loaded
            if (e.data === "embedded") {
                setEmbeddedAppHasLoaded(true);
            }
            // CONTROLLER : Open file request
            if (e.data.startsWith("openFile:")) {
                // Get fileId
                const fileId = e.data.split("openFile:")[1].trim();
                // Ask EMBEDDED app to open the file in its router
                embeddedApp.current.contentWindow.postMessage('openFile:' + fileId, '*');
            }
            // EMBEDDED : Share file request
            if (e.data === "shareFile") {
                // Open share modal (knows file from currentlyOpenedFile state)
                setShareModalOpen(true);
            }
        };
    }, []);
    // Function to create a new document from the CONTROLLER app
    const createNewDocument = ()=>{
        if (!embeddedApp.current) return;
        // Ask EMBEDDED app to create a new document
        embeddedApp.current.contentWindow.postMessage('newDoc', '*');
    };
    // Sanitize path for display
    const path = currentlyOpenedFile ? currentlyOpenedFile.path.replace(currentlyOpenedFile.name, '') : '';
    const sanitizedPath = path.endsWith('/') ? path.slice(0, -1) : path;
    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
        className: `${_styles_iframes_styl__WEBPACK_IMPORTED_MODULE_4__["default"].iframesContainer} ${_styles_iframes_styl__WEBPACK_IMPORTED_MODULE_4__["default"]["iframesContainer--" + (isMobile ? "mobile" : "desktop")]}`,
        children: [
            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(cozy_bar__WEBPACK_IMPORTED_MODULE_5__.BarLeft, {
                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(cozy_ui_transpiled_react_Buttons__WEBPACK_IMPORTED_MODULE_9__["default"], {
                    label: !controllerHasLoaded ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(cozy_ui_transpiled_react_Progress__WEBPACK_IMPORTED_MODULE_10__["default"], {
                        size: 20
                    }, void 0, false, {
                        fileName: "/Users/vincelinise/Documents/GitHub/cozy-lasuite-docs/src/components/App.jsx",
                        lineNumber: 134,
                        columnNumber: 15
                    }, void 0) : /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(cozy_ui_transpiled_react_Icon__WEBPACK_IMPORTED_MODULE_11__["default"], {
                        icon: cozy_ui_transpiled_react_Icons_Burger__WEBPACK_IMPORTED_MODULE_12__["default"],
                        size: 20
                    }, void 0, false, {
                        fileName: "/Users/vincelinise/Documents/GitHub/cozy-lasuite-docs/src/components/App.jsx",
                        lineNumber: 136,
                        columnNumber: 15
                    }, void 0),
                    variant: "text",
                    color: "inherit",
                    size: "large",
                    onClick: ()=>setDriveOpen(!driveOpen),
                    style: {
                        padding: 0,
                        width: 42,
                        height: 42,
                        margin: "0 4px",
                        marginLeft: !isMobile ? -8 : 0
                    },
                    disabled: !controllerHasLoaded
                }, void 0, false, {
                    fileName: "/Users/vincelinise/Documents/GitHub/cozy-lasuite-docs/src/components/App.jsx",
                    lineNumber: 131,
                    columnNumber: 9
                }, undefined)
            }, void 0, false, {
                fileName: "/Users/vincelinise/Documents/GitHub/cozy-lasuite-docs/src/components/App.jsx",
                lineNumber: 130,
                columnNumber: 7
            }, undefined),
            currentlyOpenedFile ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(cozy_bar__WEBPACK_IMPORTED_MODULE_5__.BarCenter, {
                children: currentlyOpenedFile.path ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("a", {
                    style: {
                        color: 'inherit',
                        textDecoration: 'none',
                        marginLeft: 4
                    },
                    onClick: (e)=>{
                        e.preventDefault();
                        // Ask CONTROLLER app to open the parent folder
                        if (!controllerApp.current) return;
                        controllerApp.current.contentWindow.postMessage('openFolder:' + currentlyOpenedFile.dir_id, '*');
                    },
                    href: "#",
                    className: "u-flex u-flex-column",
                    children: [
                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(cozy_ui_transpiled_react_Typography__WEBPACK_IMPORTED_MODULE_13__["default"], {
                            variant: "subtitle2",
                            children: currentlyOpenedFile.name
                        }, void 0, false, {
                            fileName: "/Users/vincelinise/Documents/GitHub/cozy-lasuite-docs/src/components/App.jsx",
                            lineNumber: 162,
                            columnNumber: 15
                        }, undefined),
                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(cozy_ui_transpiled_react_Typography__WEBPACK_IMPORTED_MODULE_13__["default"], {
                            variant: "caption",
                            children: sanitizedPath
                        }, void 0, false, {
                            fileName: "/Users/vincelinise/Documents/GitHub/cozy-lasuite-docs/src/components/App.jsx",
                            lineNumber: 163,
                            columnNumber: 15
                        }, undefined)
                    ]
                }, void 0, true, {
                    fileName: "/Users/vincelinise/Documents/GitHub/cozy-lasuite-docs/src/components/App.jsx",
                    lineNumber: 151,
                    columnNumber: 13
                }, undefined) : /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {}, void 0, false)
            }, void 0, false, {
                fileName: "/Users/vincelinise/Documents/GitHub/cozy-lasuite-docs/src/components/App.jsx",
                lineNumber: 149,
                columnNumber: 9
            }, undefined) : /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(cozy_bar__WEBPACK_IMPORTED_MODULE_5__.BarCenter, {
                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(cozy_ui_transpiled_react_BarTitle__WEBPACK_IMPORTED_MODULE_14__["default"], {
                    children: "Docs"
                }, void 0, false, {
                    fileName: "/Users/vincelinise/Documents/GitHub/cozy-lasuite-docs/src/components/App.jsx",
                    lineNumber: 171,
                    columnNumber: 11
                }, undefined)
            }, void 0, false, {
                fileName: "/Users/vincelinise/Documents/GitHub/cozy-lasuite-docs/src/components/App.jsx",
                lineNumber: 170,
                columnNumber: 9
            }, undefined),
            !isMobile && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(cozy_bar__WEBPACK_IMPORTED_MODULE_5__.BarRight, {
                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(cozy_ui_transpiled_react_Buttons__WEBPACK_IMPORTED_MODULE_9__["default"], {
                    label: "Nouveau document",
                    variant: "primary",
                    size: "small",
                    startIcon: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(cozy_ui_transpiled_react_Icon__WEBPACK_IMPORTED_MODULE_11__["default"], {
                        icon: cozy_ui_transpiled_react_Icons_Plus__WEBPACK_IMPORTED_MODULE_15__["default"]
                    }, void 0, false, {
                        fileName: "/Users/vincelinise/Documents/GitHub/cozy-lasuite-docs/src/components/App.jsx",
                        lineNumber: 183,
                        columnNumber: 24
                    }, void 0),
                    onClick: ()=>createNewDocument(),
                    className: "u-mr-1"
                }, void 0, false, {
                    fileName: "/Users/vincelinise/Documents/GitHub/cozy-lasuite-docs/src/components/App.jsx",
                    lineNumber: 179,
                    columnNumber: 11
                }, undefined)
            }, void 0, false, {
                fileName: "/Users/vincelinise/Documents/GitHub/cozy-lasuite-docs/src/components/App.jsx",
                lineNumber: 178,
                columnNumber: 9
            }, undefined),
            shareModalOpen && currentlyOpenedFile && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(cozy_sharing__WEBPACK_IMPORTED_MODULE_16__.ShareModal, {
                document: currentlyOpenedFile,
                documentType: "Files",
                sharingDesc: currentlyOpenedFile.name,
                onClose: ()=>setShareModalOpen(false)
            }, void 0, false, {
                fileName: "/Users/vincelinise/Documents/GitHub/cozy-lasuite-docs/src/components/App.jsx",
                lineNumber: 191,
                columnNumber: 9
            }, undefined),
            embeddedAppHasLoaded && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("iframe", {
                ref: controllerApp,
                className: `${_styles_iframes_styl__WEBPACK_IMPORTED_MODULE_4__["default"].controllerApp} ${_styles_iframes_styl__WEBPACK_IMPORTED_MODULE_4__["default"]["controllerApp--" + (isMobile ? "mobile" : "desktop")]} ${driveOpen ? _styles_iframes_styl__WEBPACK_IMPORTED_MODULE_4__["default"].open : ""}`,
                id: "controllerApp",
                src: controllerAppUrl
            }, void 0, false, {
                fileName: "/Users/vincelinise/Documents/GitHub/cozy-lasuite-docs/src/components/App.jsx",
                lineNumber: 200,
                columnNumber: 9
            }, undefined),
            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("iframe", {
                ref: embeddedApp,
                className: `${_styles_iframes_styl__WEBPACK_IMPORTED_MODULE_4__["default"].embeddedApp} ${_styles_iframes_styl__WEBPACK_IMPORTED_MODULE_4__["default"]["embeddedApp--" + (isMobile ? "mobile" : "desktop")]}`,
                id: "embeddedApp",
                src: isReady ? urlToLoad : null
            }, void 0, false, {
                fileName: "/Users/vincelinise/Documents/GitHub/cozy-lasuite-docs/src/components/App.jsx",
                lineNumber: 203,
                columnNumber: 7
            }, undefined)
        ]
    }, void 0, true, {
        fileName: "/Users/vincelinise/Documents/GitHub/cozy-lasuite-docs/src/components/App.jsx",
        lineNumber: 129,
        columnNumber: 5
    }, undefined);
};
/* ESM default export */ const __WEBPACK_DEFAULT_EXPORT__ = (App);


}),

},function(__webpack_require__) {
// webpack/runtime/get_full_hash
(() => {
__webpack_require__.h = () => ("a01c549f1ef5f10c")
})();

}
);
//# sourceMappingURL=main.4a8f7fc7f3eb60fe.hot-update.js.map