# Live Effects Functions for Illustrator

A set of ExtendScript convenience functions for applying Live Effects in Adobe Illustrator.

---

## Why these functions?

The pageItem.applyEffect method is difficult to use. It takes an XML string as its one parameter, for which there is no official documentation. The knowledge of the XML string has been gleaned over years by many people, and passed on, often through the Adobe community forum. Finding the details can be laborious, and implementation can be a little painful.

My aim with these functions is to hide away all that esoteric complication behind a neat and tidy api, so to speak.

---

## Important note

Some of the Live Effects functions simply don't work right, probably due to my lack of knowledge. See my [notes document](https://mark1bean.github.io/live-effect-functions-for-illustrator/) for the status of each function. Any help or improvements welcome!

---

## Installation

Download the [latest release](https://github.com/mark1bean/live-effect-functions-for-illustrator/releases/latest/download/live-effect-functions-for-illustrator.zip) and add `//@include LE_Functions.js` to the beginning of your own script. Look through the LE_Function.js file and read the Usage section below.

> Note: `LE_Functions.js` and `LE.js` must be in same folder.

---

## Usage

Every LE function takes two parameters: `item` and `options`.

`item` is the pageItem (or pageItems!) to which the Live Effect will apply. Can be a single pageItem, or an array of pageItems, or an Illustrator array-like object, eg pageItems.

`options` is an object that holds all other parameters. If options is not supplied, the functions will simply use their default settings.

Internally, each function has a defaults object. Here is an example of the defaults object from `LE_InnerGlow`:

```javascript
var defaults = {
    blendMode: 2,                /* 0 normal, 1 multiply, 2 screen, ... */
    glowType: 0,                 /* 0 center, 1 edge */
    opacity: 0.75,               /* 0...1 */
    blur: 5,                     /* px */
    glowColor: [255, 255, 255],  /* [C,M,Y,K], [R,G,B] or [K] */
    expandAppearance: false
}
```

So calling the function without supplying `options`, means those defaults will apply.

```javascript
LE_InnerGlow(item);
```

> Refer to the `defaults` object if you aren't sure what parameters it can take.

To override the defaults, populate an `options` object with any params you wish, like this:

```javascript
var myOptions = {
    opacity: 0.6,
    blur: 10,
    glowColor: [0, 20, 100, 0],
}
LE_InnerGlow(item, myOptions);
```

or, if you prefer, like this:

```javascript
LE_InnerGlow(item, {
    opacity: 0.6,
    blur: 10,
    glowColor: [0, 20, 100, 0],
});
```

For one or two parameters, inline works well:

```javascript
LE_InnerGlow(item, {opacity: 0.5, blur: 15});
```

You can supply an array (or Illustrator array-like object) in place of the `item` parameter to apply the effect to multiple items, for example:

```javascript
LE_InnerGlow(selection);
```

---

## Expand Appearance

Calling any function with option `expandAppearance: true` will expand the item's appearance (identical to Expand Appearance menu command) immediately after applying the effect.

```javascript
LE_InnerGlow(item, {blur: 15, expandAppearance: true});
```

---

## System requirements

Adobe Illustrator CS6 and above. As of 2021-01-25, tested only on version 25 (Mac OS 11.1).

---

## Acknowledgements

Thanks to lots of help and encouragement from CarlosCanto, Silly-V, femkeblanco and KurtGold at [community.adobe.com](https://community.adobe.com)

Thanks to the contributors at [gl-mat4](https://github.com/stackgl/gl-mat4) where I found some excellent 3D matrix functions that saved me a lot of time.
