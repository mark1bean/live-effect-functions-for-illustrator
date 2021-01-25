var LE = {
    /* helper object for Live Effect scripts */
    functionName: 'LE',
    testMode: false,
    debug: false,
    defaults: {},

    defaultsObject: function (item, defaults, options, func) {
        /* combines defaults and user-specified options along with a little admin work */
        LE.functionName = func.name;
        if (item == undefined || item.typename == undefined) throw new Error(func.name + ' failed. No item available.');
        try {
            if (defaults == undefined && options == undefined) return {};
            if (defaults == undefined) return options;
            if (options == undefined) return defaults;
            if (options.debug) LE.debug = true;
            for (var key in options) {
                defaults[key] = options[key];
            }
            LE.defaults = defaults;
            return defaults;
        } catch (error) {
            throw new Error(func.name + ' failed to parse options object. ' + error)
        }
    },

    applyEffect: function (item, xml, expand) {
        /* applies the live effect, unless in test mode */
        if (LE.testMode) {
            LE.testResults.push({ timestamp: new Date(), functionName: LE.functionName, xml: xml });
        } else {
            item.applyEffect(xml);
            if (expand) LE.expandAppearance(item);
            if (LE.debug) $.writeln(LE.functionName + ':\n' + xml);
        }
    },

    handleError: function (error) {
        /* called when errors happen */
        alert(error.message);
    },

    expandAppearance: function (item) {
        app.redraw();
        app.executeMenuCommand('expandStyle');
        item = app.activeDocument.selection[0];
    },

    formatColor: function (colr) {
        /* converts various color formats for live effect style color */
        // colr can be supplied as CMYKColor or [100,100,100,50] or '100 100 100 50', RGBColor or [255,255,128] or '255 255 128' or '100% 100% 50%', GrayColor or [100] or '100'
        if (colr == undefined) throw new Error(LE.functionName + ': No color available');
        var colorCode, breakdown;
        if (typeof colr == 'string') {
            var isPercent = (colr.search('%') != -1);
            // make into array
            colr = colr.match(/-?\d+\.?\d*%?/g);
            if (colr == undefined) throw new Error(String(LE.functionName) + ': Couldn\'t parse color.');
        }
        if (Object.prototype.toString.call(colr) === '[object Array]') {
            for (var i = 0; i < colr.length; i++) colr[i] = parseFloat(colr[i]);
            switch (colr.length) {
                case 1: // [K]
                    colorCode = 0;
                    breakdown = [Number(colr[0]) / 100];
                    break;
                case 3: // [R,G,B]
                    colorCode = 5;
                    var divisor = isPercent ? 100 : 255;
                    breakdown = [Number(colr[0]) / divisor, Number(colr[1]) / divisor, Number(colr[2]) / divisor];
                    break;
                case 4: // [C,M,Y,K]
                    colorCode = 1;
                    breakdown = [colr[0] / 100, colr[1] / 100, colr[2] / 100, colr[3] / 100];
                    break;
                default:
                    throw new Error(String(LE.functionName) + ': Couldn\'t parse color (' + colr + ')');
            }
            for (var i = 0; i < breakdown.length; i++) breakdown[i] = Math.round(Number(breakdown[i]) * 1000) / 1000;

        } else if (colr.typename != undefined) {
            switch (colr.typename) {
                case 'GrayColor':
                    colorCode = 0;
                    breakdown = [colr.gray / 100];
                    break;
                case 'RGBColor':
                    colorCode = 5;
                    breakdown = [colr.red / 255, colr.green / 255, colr.blue / 255];
                    break;
                case 'CMYKColor':
                    colorCode = 1;
                    breakdown = [colr.cyan / 100, colr.magenta / 100, colr.yellow / 100, colr.black / 100];
                    break;
                default:
                    throw new Error(String(LE.functionName) + ': Couldn\'t parse color of type \'' + colr.typename + '\'');
            }
        }
        return [colorCode].concat(breakdown).join(' ');
    },

    transformPoints: [
        Transformation.TOPLEFT, Transformation.TOP, Transformation.TOPRIGHT,
        Transformation.LEFT, Transformation.CENTER, Transformation.RIGHT,
        Transformation.BOTTOMLEFT, Transformation.BOTTOM, Transformation.BOTTOMRIGHT
    ]
}