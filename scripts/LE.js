/*
    LE - Helper object for Live Effect scripts
*/

var LE = {
    functionName: 'LE',
    testMode: false,
    debug: false,
    defaults: {},

    /**
     * Combines defaults and user-specified options along with a little admin work
     * @param {(PageItem|PageItems)} item - A PageItem or collection or array of PageItems
     * @param {Object} defaults - Object with default properties
     * @param {Object} options - Object with user supplied properties
     * @param {Function} func - The LE_Function
     */
    defaultsObject: function (item, defaults, options, func) {
        LE.functionName = func.name;
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


    /**
     * Applies the Live Effect, unless in test mode
     * @param {(PageItem|PageItems)} item - A PageItem or collection or array of PageItems
     * @param {String} xml - The Live Effect XML to apply
     * @param {Boolean} expand - Perform Expand Appearance
     */
    applyEffect: function (item, xml, expand) {
        if (LE.testMode) {
            LE.testResults.push({ timestamp: new Date(), functionName: LE.functionName, xml: xml });
            return xml;
        } else {
            // work out whether item is single item or multiple
            var items;
            if (item == undefined) {
                throw new Error(LE.functionName + ' failed. No item available.');
            } else if (item[0] == undefined && item.typename != undefined) {
                // a single item
                items = [item];
            }
            if (items.length == undefined) throw new Error(LE.functionName + ' failed. Unexpected item type. [1]');
            // applyEffect to each item
            for (var i = 0; i < items.length; i++) {
                if (items[i].typename == undefined) throw new Error(LE.functionName + ' failed. Unexpected item type. [2]');
                items[i].applyEffect(xml);
                if (expand) LE.expandAppearance(items[i]);
            }
            if (LE.debug) $.writeln(LE.functionName + ':\n' + xml);
        }
    },

    /**
     * Handles error
     * @param {Error} error - a javascript Error
     */
    handleError: function (error) {
        alert(error.message);
    },

    /**
     * Performs Expand Appearance
     * @param {PageItem} item - a PageItem
     */
    expandAppearance: function (item) {
        app.redraw();
        app.activeDocument.selection = [item];
        app.executeMenuCommand('expandStyle');
        item = app.activeDocument.selection[0];
    },


    /**
     * Converts various color formats for live effect style color
     * @param {(CMYKColor|RGBColor|Array|String)} colr - can be CMYKColor or [100,100,100,50] or '100 100 100 50', RGBColor or [255,255,128] or '255 255 128' or '100% 100% 50%', GrayColor or [100] or '100'
     */
    formatColor: function (colr) {
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

    /**
     * "Map" of transform points.
     */
    transformPoints: [
        Transformation.TOPLEFT, Transformation.TOP, Transformation.TOPRIGHT,
        Transformation.LEFT, Transformation.CENTER, Transformation.RIGHT,
        Transformation.BOTTOMLEFT, Transformation.BOTTOM, Transformation.BOTTOMRIGHT
    ]

}