# AI Live Effects Functions

A set of ExtendScript convenience functions for applying Live Effects in Adobe Illustrator.

---
## How to install

Download the [script files](https://github.com/mark1bean/ai-live-effect-functions/archive/master.zip) and use the LE functions in your own scripts.

> [!IMPORTANT]
> Each function in `LE_Functions.js` relies on `LE.js`, so you need them both.


---
## How to call the functions

Every LE function takes two parameters: `item` and `options`.

`item` is the pageItem to which the Live Effect will apply. The functions will error if no item is supplied.

`options` is an object that holds all other parameters. If options is not supplied, the functions will simply use their default settings.


Internally, each function has a defaults object. Here is an example of the defaults object from `LE_InnerGlow`:

```
var defaults = {
    blendMode: 2,                /* 0 normal, 1 multiply, 2 screen, ... */
    glowType: 0,                 /* 0 center, 1 edge */
    opacity: 0.75,               /* 0...1 */
    blur: 5,                     /* px */
    glowColor: [255, 255, 255],  /* [C,M,Y,K], [R,G,B] or [K] */
    expandAppearance: false
}
```

So calling the function without options, means those defaults will apply.

```
LE_InnerGlow(item);
```

> [!TIP]
> Refer to the `defaults` object if you aren't sure what parameters it can take.

To override the defaults, populate an options object with any params you wish, like this:

```
var myOptions = {
    opacity: 0.6,
    blur: 10,
    glowColor: [0, 20, 100, 0],
}
LE_InnerGlow(item, myOptions);
```

or, if you prefer, like this:

```
LE_InnerGlow(item, {
    opacity: 0.6,
    blur: 10,
    glowColor: [0, 20, 100, 0],
});
```

For one or two parameters, inline works well:
```
LE_InnerGlow(item, {opacity: 0.5, blur: 15});
```

---
## Special features:

Calling any function with option `expandAppearance: true` will expand the item's appearance (identical to Expand Appearance menu command) immediately after applying the effect.

---
## System requirements:

Adobe Illustrator. As of 2021-01-25, tested only on version 25 (Mac OS 11.1).
