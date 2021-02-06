//@include 'LE.js'

/* -------------------------------------------------------------------------------------------- */
function LE_3DBevelAndExtrude(item, options) {
    if (options == undefined || typeof options != 'object') options = {};
    options.effectType = 0;
    LE_3DEffect(item, options);
}

/* -------------------------------------------------------------------------------------------- */
function LE_3DRevolve(item, options) {
    if (options == undefined || typeof options != 'object') options = {};
    options.effectType = 1;
    LE_3DEffect(item, options);
}

/* -------------------------------------------------------------------------------------------- */
function LE_3DRotate(item, options) {
    if (options == undefined || typeof options != 'object') options = {};
    options.effectType = 2;
    if (options.surfaceStyle == undefined) options.surfaceStyle = 2;
    LE_3DEffect(item, options);
}

/* -------------------------------------------------------------------------------------------- */
function LE_3DEffect(item, options) {
    try {
        var defaults = {
            effectType: 0,             /* 0 = 3D Bevel & Extrude, 1 = 3D Revolve, 2 = 3D Rotate */
            rotXdegrees: -22,
            rotYdegrees: -22,
            rotZdegrees: 8,
            cameraPerspective: 0,
            extrudeDepthPts: 100,
            extrudeCap: true,
            surfaceStyle: 3,            /* 0 = wireframe, 1 = no shading, 2 = diffuse, 3 = plastic */
            shadeMode: 2,               /* 0 = none, 1 = black, 2 = custom color */
            highlightIntensity: 60,
            highlightSizePercent: 90,
            shadingColor: [0, 0, 0],    /* RGB Black; also accepts [C,M,Y,K], [R,G,B] or [K] */
            ambientLight: 70,
            blendSteps: 25,
            preserveSpots: false,
            lights: [
                {
                    lightIntensity: 1,
                    lightDirX: -0.99,
                    lightDirY: 0,
                    lightDirZ: -1,
                    lightPosX: 0,
                    lightPosY: 0,
                    lightPosZ: -1
                }
            ],
            revolveAngle: 360,
            revolveOffset: 0,
            revolveCap: true,
            revolveAxisMode: 0,
            bevelHeightPts: 4,
            bevelExtentIn: true,
            showHiddenSurfaces: false,
            invisibleGeo: false,
            shadeMaps: 0,
            numArtMaps: 0,
            expandAppearance: false
        }
        var o = LE.defaultsObject(item, defaults, options, arguments.callee);
        o.rotationMatrix = mat4RotationFromXYZ(o.rotXdegrees, o.rotYdegrees, o.rotZdegrees);
        o.effectName = ['Bevel & Extrude', 'Revolve', 'Rotate'][o.effectType];
        var xml = '<LiveEffect name="Adobe 3D Effect"><Dict data="#matrix I effectStyle #0 R rotX #1 R rotY #2 R rotZ #3 R cameraPerspective #4 R extrudeDepth #5 R surfaceAmbient #6 I shadeMode #7 I surfaceStyle #8 R surfaceMatte #9 R surfaceGloss #10 R blendSteps #11 B preserveSpots #12 B extrudeCap #13 R revolveAngle #14 R revolveOffset #15 B revolveCap #16 I revolveAxisMode #17 R bevelHeight #18 B bevelExtentIn #19 B shadeMaps #20 B showHiddenSurfaces #21 B invisibleGeo #22 I numArtMaps #23 I 3Dversion 2 B paramsDictionaryInitialized 1 I numLights #numLights "><Entry name="shadeColor" valueType="F"><Fill color="#color"/></Entry>#lights<Entry name="DisplayString" value="3D: #display" valueType="S"/></Dict></LiveEffect>'
            .replace(/#matrix/, xmlFromMat4(o.rotationMatrix))
            .replace(/#0/, o.effectType)
            .replace(/#1/, o.rotXdegrees)
            .replace(/#2/, o.rotYdegrees)
            .replace(/#3/, o.rotZdegrees)
            .replace(/#4/, o.cameraPerspective)
            .replace(/#5/, o.extrudeDepthPts)
            .replace(/#6/, o.ambientLight)
            .replace(/#7/, o.shadeMode)
            .replace(/#8/, o.surfaceStyle)
            .replace(/#9/, 100 - o.highlightIntensity)
            .replace(/#10/, 100 - o.highlightSizePercent)
            .replace(/#11/, o.blendSteps)
            .replace(/#12/, o.preserveSpots ? 1 : 0)
            .replace(/#13/, o.extrudeCap ? 1 : 0)
            .replace(/#14/, o.revolveAngle)
            .replace(/#15/, o.revolveOffset)
            .replace(/#16/, o.revolveCap ? 1 : 0)
            .replace(/#17/, o.revolveAxisMode)
            .replace(/#18/, o.bevelHeightPts)
            .replace(/#19/, o.bevelExtentIn ? 1 : 0)
            .replace(/#20/, o.shadeMaps)
            .replace(/#21/, o.showHiddenSurfaces ? 1 : 0)
            .replace(/#22/, o.invisibleGeo ? 1 : 0)
            .replace(/#23/, o.numArtMaps)
            .replace(/#numLights/, o.lights.length)
            .replace(/#lights/, xmlFromLights(o.lights))
            .replace(/#color/, LE.formatColor(o.shadingColor))
            .replace(/#display/, o.effectName);
        LE.applyEffect(item, xml, o.expandAppearance);
    } catch (error) {
        LE.handleError(error);
    }
    function xmlFromLights(lights) {
        var xml = [], lightXML;
        var lightTemplateXML = '<Entry name="light#1" valueType="D"><Dict data="#2 " /></Entry>';
        for (var i = 0; i < lights.length; i++) {
            var light = lights[i], keyValues = [];
            for (var key in light) {
                keyValues.push('R ' + key + ' ' + light[key]);
            }
            xml.push(lightTemplateXML
                .replace(/#1/, i)
                .replace(/#2/, keyValues.join(' '))
            );
        }
        return xml.join(' ');
    }
    function mat4RotationFromXYZ(rotX, rotY, rotZ) {
        var mat4X = mat4_Create();
        var mat4Y = mat4_Create();
        var mat4Z = mat4_Create();
        var mat4Rotation = mat4_Create();
        mat4_FromXRotation(mat4X, asRadians(-rotX));
        mat4_FromYRotation(mat4Y, asRadians(-rotY));
        mat4_FromZRotation(mat4Z, asRadians(-rotZ));
        mat4_Multiply(mat4Rotation, mat4Rotation, mat4X);
        mat4_Multiply(mat4Rotation, mat4Rotation, mat4Y);
        mat4_Multiply(mat4Rotation, mat4Rotation, mat4Z);
        var adjointMat4 = mat4_Create();
        adjointMat4 = mat4_Adjoint(adjointMat4, mat4Rotation);
        return adjointMat4;
    }
    function xmlFromMat4(mat4) {
        var result = [], keys = ['mat_00', 'mat_01', 'mat_02', 'mat_03', 'mat_10', 'mat_11', 'mat_12', 'mat_13', 'mat_20', 'mat_21', 'mat_22', 'mat_23', 'mat_30', 'mat_31', 'mat_32', 'mat_33'];
        for (var i = 0; i < 16; i++) {
            result.push('R ' + keys[i] + ' ' + mat4[i]);
        }
        return result.join(' ');
    }
    function asRadians(degrees) {
        return degrees * 0.01745329;
    }
    /*  gl-mat4 functions: For attribution and license visit https://github.com/stackgl/gl-mat4 */
    function mat4_Create() {
        /* Creates a new identity mat4 */
        var out = new Array(16);
        out[0] = 1; out[1] = 0; out[2] = 0; out[3] = 0; out[4] = 0; out[5] = 1; out[6] = 0; out[7] = 0; out[8] = 0; out[9] = 0; out[10] = 1; out[11] = 0; out[12] = 0; out[13] = 0; out[14] = 0; out[15] = 1;
        return out;
    }
    function mat4_Multiply(out, a, b) {
        /* multiplies two mat4s */
        var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
            a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
            a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
            a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
        // Cache only the current line of the second matrix
        var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
        out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
        out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
        out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
        out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        return out;
    }
    function mat4_FromXRotation(out, rad) {
        /* Creates a matrix from the given angle around the X axis */
        var s = Math.sin(rad),
            c = Math.cos(rad);
        // Perform axis-specific matrix multiplication
        out[0] = 1; out[1] = 0; out[2] = 0; out[3] = 0; out[4] = 0; out[5] = c; out[6] = s; out[7] = 0; out[8] = 0; out[9] = -s; out[10] = c; out[11] = 0; out[12] = 0; out[13] = 0; out[14] = 0; out[15] = 1;
        return out;
    }
    function mat4_FromYRotation(out, rad) {
        /* Creates a matrix from the given angle around the Y axis */
        var s = Math.sin(rad),
            c = Math.cos(rad);
        // Perform axis-specific matrix multiplication
        out[0] = c; out[1] = 0; out[2] = -s; out[3] = 0; out[4] = 0; out[5] = 1; out[6] = 0; out[7] = 0; out[8] = s; out[9] = 0; out[10] = c; out[11] = 0; out[12] = 0; out[13] = 0; out[14] = 0; out[15] = 1;
        return out;
    }
    function mat4_FromZRotation(out, rad) {
        /* Creates a matrix from the given angle around the Z axis */
        var s = Math.sin(rad),
            c = Math.cos(rad)
        // Perform axis-specific matrix multiplication
        out[0] = c; out[1] = s; out[2] = 0; out[3] = 0; out[4] = -s; out[5] = c; out[6] = 0; out[7] = 0; out[8] = 0; out[9] = 0; out[10] = 1; out[11] = 0; out[12] = 0; out[13] = 0; out[14] = 0; out[15] = 1;
        return out
    }
    function mat4_Adjoint(out, a) {
        /* Calculates the adjugate of a mat4 */
        var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
            a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
            a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
            a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
        out[0] = (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
        out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
        out[2] = (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
        out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
        out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
        out[5] = (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
        out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
        out[7] = (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
        out[8] = (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
        out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
        out[10] = (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
        out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
        out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
        out[13] = (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
        out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
        out[15] = (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
        return out;
    }
}

/* -------------------------------------------------------------------------------------------- */
function LE_ConvertToShape_Rectangle(item, options) {
    /* example customization of LE_ConvertToShape */
    if (options == undefined || typeof options != 'object') options = {};
    options.shapeType = 0; // rectange
    LE_ConvertToShape(item, options);
}

/* -------------------------------------------------------------------------------------------- */
function LE_ConvertToShape_RoundedRectangle(item, options) {
    /* example customization of LE_ConvertToShape */
    if (options == undefined || typeof options != 'object') options = {};
    options.shapeType = 1; // rounded rectange
    LE_ConvertToShape(item, options);
}

/* -------------------------------------------------------------------------------------------- */
function LE_ConvertToShape_Ellipse(item, options) {
    /* example customization of LE_ConvertToShape */
    if (options == undefined || typeof options != 'object') options = {};
    options.shapeType = 2; // ellipse
    LE_ConvertToShape(item, options);
}

/* -------------------------------------------------------------------------------------------- */
function LE_ConvertToShape(item, options) {
    // note: this function messes up the item's appearance!
    // to manually fix: in Appeance panel, drag effect above Stroke and Fill
    try {
        var defaults = {
            shapeType: 0,          /* 0 = rectangle, 1 = rounded rectangle, 2 = ellipse */
            widthPts: 0,
            heightPts: 0,
            absoluteness: false,   /* true or false */
            cornerRadiusPts: 9,
            expandAppearance: false
        }
        var o = LE.defaultsObject(item, defaults, options, arguments.callee)
        o.shapeName = ['Rectangle', 'RoundedRectangle', 'Ellipse'][o.shapeType];
        if (o.absoluteness == true || o.absoluteness > 0) {
            o.widthPts = o.widthPts || 100;
            o.heightPts = o.heightPts || 100;
        }
        var xml = '<LiveEffect name="Adobe Shape Effects"><Dict data="U DisplayString #1 I Shape #2 R RelWidth #3 R RelHeight #4 R AbsWidth #5 R AbsHeight #6 R Absolute #7 R CornerRadius #8 "/></LiveEffect>'
            .replace(/#1/, o.shapeName)
            .replace(/#2/, o.shapeType)
            .replace(/#3/, o.widthPts)
            .replace(/#4/, o.heightPts)
            .replace(/#5/, o.widthPts)
            .replace(/#6/, o.heightPts)
            .replace(/#7/, Number(o.absoluteness))
            .replace(/#8/, o.cornerRadiusPts);
        LE.applyEffect(item, xml, o.expandAppearance);
    } catch (error) {
        LE.handleError(error);
    }
}

/* -------------------------------------------------------------------------------------------- */
function LE_CropMarks(item, options) {
    /* requires LE object */
    try {
        var defaults = {
            style: 0,
            expandAppearance: false
        }
        var o = LE.defaultsObject(item, defaults, options, arguments.callee)
        var xml = '<LiveEffect name="Adobe Trim Marks"><Dict data="I styl #1 "/></LiveEffect>'
            .replace(/#1/, o.style);
        LE.applyEffect(item, xml, o.expandAppearance);
    } catch (error) {
        LE.handleError(error);
    }
}

/* -------------------------------------------------------------------------------------------- */
function LE_DropShadow(item, options) {
    try {
        var defaults = {
            blendMode: 1,            /* 0=Normal, 1=Multiply, 2=Darken, etc. */
            opacity: 0.75,           /* 0...1 */
            horzOffsetPts: 7,
            vertOffsetPts: 7,
            blur: 5,
            useDarkness: false,      /* if true, will use 'Color' */
            darkness: 100,
            usePSLBlur: true,
            pair: true,
            shadowColor: [0, 0, 0],  /* RGB Black; also accepts [C,M,Y,K], [R,G,B] or [K] */
            expandAppearance: false
        }
        var o = LE.defaultsObject(item, defaults, options, arguments.callee)
        var xml = '<LiveEffect name="Adobe Drop Shadow"><Dict data="I blnd #1 R opac #2 R horz #3 R vert #4 R blur #5 B usePSLBlur #6 I csrc #7 R dark #8 B pair #9 "><Entry name="sclr" valueType="F"><Fill color="#10"/></Entry></Dict></LiveEffect>'
            .replace(/#1/, o.blendMode)
            .replace(/#2/, o.opacity)
            .replace(/#3/, o.horzOffsetPts)
            .replace(/#4/, o.vertOffsetPts)
            .replace(/#5/, o.blur)
            .replace(/#6/, o.usePSLBlur ? 1 : 0)
            .replace(/#7/, o.useDarkness ? 1 : 0)
            .replace(/#8/, o.darkness)
            .replace(/#9/, o.pair ? 1 : 0)
            .replace(/#10/, LE.formatColor(o.shadowColor));
        LE.applyEffect(item, xml, o.expandAppearance);
    } catch (error) {
        LE.handleError(error);
    }
}

/* -------------------------------------------------------------------------------------------- */
function LE_Feather(item, options) {
    try {
        var defaults = {
            radius: 10,
            expandAppearance: false
        }
        var o = LE.defaultsObject(item, defaults, options, arguments.callee)
        var xml = '<LiveEffect name="Adobe Fuzzy Mask"><Dict data="R Radius #1 "/></LiveEffect>'
            .replace(/#1/, o.radius);
        LE.applyEffect(item, xml, o.expandAppearance);
    } catch (error) {
        LE.handleError(error);
    }
}

/* -------------------------------------------------------------------------------------------- */
function LE_FreeDistort_Random(item, options) {
    /* example customization - move each point by a random amount */
    if (options == undefined || typeof options != 'object') options = {};
    options.variance = options.variance || 0.2; /* 0...1 where 1 = full width or height of the bounds */
    options.distortRect = [[0 + r(), 0 + r()], [1 + r(), 0 + r()], [0 + r(), 1 + r()], [1 + r(), 1 + r()]];
    LE_FreeDistort(item, options);
    function r() { return Math.random() * options.variance - (options.variance / 2); }
}

/* -------------------------------------------------------------------------------------------- */
function LE_FreeDistort_Twist(item, options) {
    /* example customization - swap the bottom two points around */
    if (options == undefined || typeof options != 'object') options = {};
    options.distortRect = [[0, 0], [1, 0], [1, 1], [0, 1]];  /* [ TL, TR, BL, BR ] */
    LE_FreeDistort(item, options);
}

/* -------------------------------------------------------------------------------------------- */
function LE_FreeDistort(item, options) {
    // rects: [TL, TR, BL, BR], points: [x,y]
    // distortion is relative to sourceRect (optional parameter) which is a unit square by default
    // example to cause 50% vertical scale:
    //     LE_FreeDistort(item, { distortRect: [[0, 0], [1, 0], [0, 0.5], [1, 0.5]] });
    try {
        var defaults = {
            distortRect: [[0, 0], [1.25, 0.25], [0.25, 0.75], [0.75, 0.75]],  /* [ TL, TR, BL, BR ] */
            sourceRect: [[0, 0], [1, 0], [0, 1], [1, 1]], /* Note: problably never need to specify sourceRect */
            expandAppearance: false
        }
        var o = LE.defaultsObject(item, defaults, options, arguments.callee)
        var xml = '<LiveEffect name="Adobe Free Distort"><Dict data="R src0h #1 R src0v #2 R src1h #3 R src1v #4 R src2h #5 R src2v #6 R src3h #7 R src3v #8 R dst0h #9 R dst0v #10 R dst1h #11 R dst1v #12 R dst2h #13 R dst2v #14 R dst3h #15 R dst3v #16 "/></LiveEffect>'
            .replace(/#1/, o.sourceRect[0][0])
            .replace(/#2/, -o.sourceRect[0][1])
            .replace(/#3/, o.sourceRect[1][0])
            .replace(/#4/, -o.sourceRect[1][1])
            .replace(/#5/, o.sourceRect[2][0])
            .replace(/#6/, -o.sourceRect[2][1])
            .replace(/#7/, o.sourceRect[3][0])
            .replace(/#8/, -o.sourceRect[3][1])
            .replace(/#9/, o.distortRect[0][0])
            .replace(/#10/, -o.distortRect[0][1])
            .replace(/#11/, o.distortRect[1][0])
            .replace(/#12/, -o.distortRect[1][1])
            .replace(/#13/, o.distortRect[2][0])
            .replace(/#14/, -o.distortRect[2][1])
            .replace(/#15/, o.distortRect[3][0])
            .replace(/#16/, -o.distortRect[3][1]);
        LE.applyEffect(item, xml, o.expandAppearance);
    } catch (error) {
        LE.handleError(error);
    }
}

/* -------------------------------------------------------------------------------------------- */
function LE_GaussianBlur(item, options) {
    try {
        var defaults = {
            blur: 10,
            expandAppearance: false
        }
        var o = LE.defaultsObject(item, defaults, options, arguments.callee)
        var xml = '<LiveEffect name="Adobe PSL Gaussian Blur"><Dict data="R PrevDocScale 1 I PrevDres 300 R blur #1 "></Dict></LiveEffect>'
            .replace(/#1/, o.blur);
        LE.applyEffect(item, xml, o.expandAppearance);
    } catch (error) {
        LE.handleError(error);
    }
}

/* -------------------------------------------------------------------------------------------- */
function LE_InnerGlow(item, options) {
    try {
        var defaults = {
            blendMode: 2,                /* 0 = normal, 1 = multiply, 2 = screen, etc. */
            glowType: 0,                 /* 0 = center, 1 = edge */
            opacity: 0.75,               /* 0...1 */
            blur: 5,                     /* px */
            glowColor: [255, 255, 255],  /* RGB White; also accepts [C,M,Y,K], [R,G,B] or [K] */
            expandAppearance: false
        }
        var o = LE.defaultsObject(item, defaults, options, arguments.callee)
        var xml = '<LiveEffect name="Adobe Inner Glow"><Dict data="I blnd #1 I gtyp #2 R opac #3 R blur #4 "><Entry name="gclr" valueType="F"><Fill color="#5 "/></Entry></Dict></LiveEffect>'
            .replace(/#1/, o.blendMode)
            .replace(/#2/, o.glowType)
            .replace(/#3/, o.opacity)
            .replace(/#4/, o.blur)
            .replace(/#5/, LE.formatColor(o.glowColor));
        LE.applyEffect(item, xml, o.expandAppearance);
    } catch (error) {
        LE.handleError(error);
    }
}

/* -------------------------------------------------------------------------------------------- */
function LE_OffsetPath(item, options) {
    try {
        var defaults = {
            offset: 10,
            joinType: 2,  // joinTypes: 0 = Round, 1 = Bevel , 2 = Miter
            miterLimit: 4,
            expandAppearance: false
        }
        var o = LE.defaultsObject(item, defaults, options, arguments.callee)
        var xml = '<LiveEffect name="Adobe Offset Path"><Dict data="R ofst #1 I jntp #2 R mlim #3 "/></LiveEffect>'
            .replace(/#1/, o.offset)
            .replace(/#2/, o.joinType)
            .replace(/#3/, o.miterLimit);
        LE.applyEffect(item, xml, o.expandAppearance);
    } catch (error) {
        LE.handleError(error);
    }
}

/* -------------------------------------------------------------------------------------------- */
function LE_OuterGlow(item, options) {
    try {
        var defaults = {
            blendMode: 1,            /* 0 = normal, 1 = multiply, 2 = screen, etc. */
            opacity: 0.75,           /* 0...1 */
            blur: 5,                 /* px */
            shadowColor: [0, 0, 0],  /* RGB Black; also accepts [C,M,Y,K], [R,G,B] or [K] */
            usePSLBlur: true,
            expandAppearance: false
        }
        var o = LE.defaultsObject(item, defaults, options, arguments.callee)
        var xml = '<LiveEffect name="Adobe Outer Glow"><Dict data="I blnd #1 R opac #2 R blur #3 B usePSLBlur #4 "><Entry name="sclr" valueType="F"><Fill color="#5 "/></Entry></Dict></LiveEffect>'
            .replace(/#1/, o.blendMode)
            .replace(/#2/, o.opacity)
            .replace(/#3/, o.blur)
            .replace(/#4/, o.usePSLBlur ? 1 : 0)
            .replace(/#5/, LE.formatColor(o.shadowColor));
        LE.applyEffect(item, xml, o.expandAppearance);
    } catch (error) {
        LE.handleError(error);
    }
}

/* -------------------------------------------------------------------------------------------- */
function LE_OutlineObject(item, options) {
    try {
        var defaults = {
            expandAppearance: false
        }
        var o = LE.defaultsObject(item, defaults, options, arguments.callee)
        var xml = '<LiveEffect name="Adobe Outline Type"><Dict data=" "/></LiveEffect>';
        LE.applyEffect(item, xml, o.expandAppearance);
    } catch (error) {
        LE.handleError(error);
    }
}

/* -------------------------------------------------------------------------------------------- */
function LE_OutlineStroke(item, options) {
    try {
        var defaults = {
            expandAppearance: false
        }
        var o = LE.defaultsObject(item, defaults, options, arguments.callee)
        var xml = '<LiveEffect name="Adobe Outline Stroke"><Dict data=" "/></LiveEffect>';
        LE.applyEffect(item, xml, o.expandAppearance);
    } catch (error) {
        LE.handleError(error);
    }
}

/* -------------------------------------------------------------------------------------------- */
function LE_PathFinder_MinusFront(item, options) {
    /* example customization of LE_PathFinder */
    if (options == undefined || typeof options != 'object') options = {};
    options.command = 3;
    options.precision = 5;
    LE_PathFinder(item, options);
}

/* -------------------------------------------------------------------------------------------- */
function LE_PathFinder(item, options) {
    try {
        var defaults = {
            command: 0,                 /* 0 = Add, 1 = Intersect, 2 = Exclude, 3 = Minus Front (Subtract),
                                           4 = Minus Back, 5 = Divide, 6 = Outline, 7 = Trim, 8 = Merge,
                                           9 = Crop, 10 = Hard Mix, 11 = Soft Mix, 12 = Trap */
            convertCustom: true,        /* don't know what this does, it isn't in the UI and is always true */
            removeUnpainted: true,      /* remove unpainted artwork - divide and outline only */
            mix: 0.5,                   /* soft mix command only */
            precision: 10,              /* micrometers */
            removePoints: true,         /* remove redundant points */
            trapAspect: 1,              /* trap command only */
            trapConvertCustom: true,    /* trap command only */
            trapMaxTint: 1,             /* trap command only */
            trapReverse: false,         /* trap command only */
            trapThickness: 0.25,        /* trap command only */
            trapTint: 0.4,              /* trap command only */
            trapTintTolerance: 0.05,    /* trap command only */
            expandAppearance: false
        }
        var o = LE.defaultsObject(item, defaults, options, arguments.callee)
        o.display = ['Add', 'Intersect', 'Exclude', 'Minus Front', 'Minus Back', 'Divide', 'Outline', 'Trim', 'Merge', 'Crop', 'Hard Mix', 'Soft Mix', 'Trap'][o.command];
        var xml = '<LiveEffect name="Adobe Pathfinder"><Dict data="I Command #1 B ConvertCustom #2 B ExtractUnpainted #3 R Mix #4 R Precision #5 B RemovePoints #6 R TrapAspect #7 B TrapConvertCustom #8 R TrapMaxTint #9 B TrapReverse #10 R TrapThickness #11 R TrapTint #12 R TrapTintTolerance #13"><Entry name="DisplayString" value="#14" valueType="S"/></Dict></LiveEffect>'
            .replace(/#1/, o.command)
            .replace(/#2/, o.convertCustom ? 1 : 0)
            .replace(/#3/, o.removeUnpainted ? 1 : 0)
            .replace(/#4/, o.mix)
            .replace(/#5/, o.precision)
            .replace(/#6/, o.removePoints ? 1 : 0)
            .replace(/#7/, o.trapAspect)
            .replace(/#8/, o.trapConvertCustom ? 1 : 0)
            .replace(/#9/, o.trapMaxTint)
            .replace(/#10/, o.trapReverse ? 1 : 0)
            .replace(/#11/, o.trapThickness)
            .replace(/#12/, o.trapTint)
            .replace(/#13/, o.trapTintTolerance)
            .replace(/#14/, o.display);
        LE.applyEffect(item, xml, o.expandAppearance);
    } catch (error) {
        LE.handleError(error);
    }
}

/* -------------------------------------------------------------------------------------------- */
function LE_PuckerAndBloat(item, options) {
    try {
        var defaults = {
            value: 50,              /* -200...200 */
            expandAppearance: false
        }
        var o = LE.defaultsObject(item, defaults, options, arguments.callee)
        var xml = '<LiveEffect name="Adobe Punk and Bloat"><Dict data="R d_factor #1 "/></LiveEffect>'
            .replace(/#1/, Number(o.value));
        LE.applyEffect(item, xml, o.expandAppearance);
    } catch (error) {
        LE.handleError(error);
    }
}

/* -------------------------------------------------------------------------------------------- */
function LE_Rasterize(item, options) {
    try {
        var defaults = {
            dpi: 72,
            colorType: 0, // colorTypes: 0 = RGB, 1 = CMYK, 2 = Grayscale, 3 = Bitmap
            transparentBackground: true,
            paddingInPts: 0,
            antialiasType: 0, // antialiasTypes: 0 = none, 1 = art optimizes, 2 = type optimized
            clipMask: false,
            expandAppearance: false
        }
        var o = LE.defaultsObject(item, defaults, options, arguments.callee)
        var xml = '<LiveEffect name="Adobe Rasterize"><Dict data="I colr #1 B alis #2 I dpi. #3 B mask #4 R padd #5 I optn #6 "/></LiveEffect>'
            .replace(/#1/, o.colorType + (o.transparentBackground ? 4 : 0))
            .replace(/#2/, o.antialiasType > 0 ? 1 : 0)
            .replace(/#3/, Math.round(o.dpi))
            .replace(/#4/, o.clipMask ? 1 : 0)
            .replace(/#5/, o.paddingInPts)
            .replace(/#6/, o.antialiasType == 2 ? 16 : 0);
        LE.applyEffect(item, xml, o.expandAppearance);
    } catch (error) {
        LE.handleError(error);
    }
}

/* -------------------------------------------------------------------------------------------- */
function LE_Roughen(item, options) {
    try {
        var defaults = {
            amount: 5,
            absoluteness: 0,       /* 0 or false = relative, 1 or true = absolute */
            segmentsPerInch: 10,
            smoothness: 0,         /* 0 = corners, 1 = smooth, 0.5 = halfway, 1.5 = too much? */
            expandAppearance: false
        }
        var o = LE.defaultsObject(item, defaults, options, arguments.callee)
        var xml = '<LiveEffect name="Adobe Roughen"><Dict data="R asiz #1 R size #2 R absoluteness #3 R dtal #4 R roundness #5 "/></LiveEffect>'
            .replace(/#1/, o.amount)
            .replace(/#2/, o.amount)
            .replace(/#3/, Number(o.absoluteness))
            .replace(/#4/, o.segmentsPerInch)
            .replace(/#5/, o.smoothness);
        LE.applyEffect(item, xml, o.expandAppearance);
    } catch (error) {
        LE.handleError(error);
    }
}

/* -------------------------------------------------------------------------------------------- */
function LE_RoundCorners(item, options) {
    try {
        var defaults = {
            radius: 10,   /* pts */
            expandAppearance: false
        }
        var o = LE.defaultsObject(item, defaults, options, arguments.callee)
        var xml = '<LiveEffect name="Adobe Round Corners"><Dict data="R radius #1 "/></LiveEffect>'
            .replace(/#1/, o.radius);
        LE.applyEffect(item, xml, o.expandAppearance);
    } catch (error) {
        LE.handleError(error);
    }
}

/* -------------------------------------------------------------------------------------------- */
function LE_Scribble(item, options) {
    try {
        var defaults = {
            angle: 30,               /* angle (0-360°) */
            pathOverlap: 0,          /* pathOverlap (0-1000 pts) */
            pathOverlapVariation: 5, /* pathOverlapVariation (0-1000pts) */
            strokeWidth: 3,          /* strokeWidth (0-1000pts) */
            curviness: 5,            /* curviness (0-100%) */
            curvinessVariation: 1,   /* curvinessVariation (0-100%) */
            spacing: 5,              /* spacing (0-1000pts) */
            spacingVariation: 0.5,   /* spacingVariation (0-1000pts) */
            expandAppearance: false
        }
        var o = LE.defaultsObject(item, defaults, options, arguments.callee);
        var xml = '<LiveEffect name="Adobe Scribble Fill"><Dict data="R Spacing #7 R Angle #1 R Scribbliness #5 R StrokeWidth #4 R EdgeOverlap #2 R ScribbleVariation #6 R SpacingVariation #8 R EdgeOverlapVariation #3"/></LiveEffect>'
            .replace(/#1/, o.angle)
            .replace(/#2/, o.pathOverlap)
            .replace(/#3/, o.pathOverlapVariation)
            .replace(/#4/, o.strokeWidth)
            .replace(/#5/, o.curviness / 100)
            .replace(/#6/, o.curvinessVariation / 100)
            .replace(/#7/, o.spacing)
            .replace(/#8/, o.spacingVariation);
        LE.applyEffect(item, xml, o.expandAppearance);
    } catch (error) {
        LE.handleError(error);
    }
}

/* -------------------------------------------------------------------------------------------- */
function LE_SVGFilter_Static(item, options) {
    /* example customization of LE_SVGFilter */
    if (options == undefined || typeof options != 'object') options = {};
    options.filterName = 'AI_Static';
    LE_SVGFilter(item, options);
}

/* -------------------------------------------------------------------------------------------- */
function LE_SVGFilter(item, options) {
    try {
        defaults = {
            filterName: 'AI_Alpha_4',   /* must match the name of a filter that exists in the document */
            expandAppearance: false
        };
        var o = LE.defaultsObject(item, defaults, options, arguments.callee)
        var xml = '<LiveEffect name="Adobe SVG Filter Effect"><Dict data=""><Entry name="SVGFilterUIDName" value="#1" valueType="S"/><Entry name="DisplayString" value="#2" valueType="S"/></Dict></LiveEffect>'
            .replace(/#1/, o.filterName)
            .replace(/#2/, o.filterName);
        LE.applyEffect(item, xml, o.expandAppearance);
    } catch (error) {
        LE.handleError(error);
    }
}

/* -------------------------------------------------------------------------------------------- */
function LE_Transform(item, options) {
    try {
        var defaults = {
            scaleHorzPercent: 100,
            scaleVertPercent: 100,
            moveHorzPts: 0,
            moveVertPts: 0,
            rotateDegrees: 0,
            randomize: false,
            numberOfCopies: 0,
            transformPoint: Transformation.CENTER,  /* must be a Transformation constant, eg. Transformation.BOTTOMRIGHT */
            scaleStrokes: false,
            transformPatterns: true,
            transformObjects: true,
            reflectX: false,
            reflectY: false,
            expandAppearance: false
        }
        var o = LE.defaultsObject(item, defaults, options, arguments.callee)
        o.transformIndex = 4;
        for (var i = 0; i < LE.transformPoints.length; i++) {
            if (o.transformPoint === LE.transformPoints[i]) {
                o.transformPointIndex = i;
                break;
            }
        }
        var xml = '<LiveEffect name="Adobe Transform"><Dict data="R scaleH_Percent #1 R scaleV_Percent #2 R scaleH_Factor #3 R scaleV_Factor #4 R moveH_Pts #5 R moveV_Pts #6 R rotate_Degrees #7 R rotate_Radians #8 I numCopies #9 I pinPoint #10 B scaleLines #11 B transformPatterns #12 B transformObjects #13 B reflectX #14 B reflectY #15 B randomize #16 "/></LiveEffect>'
            .replace(/#1/, o.scaleHorzPercent)
            .replace(/#2/, o.scaleVertPercent)
            .replace(/#3/, o.scaleHorzPercent / 100)
            .replace(/#4/, o.scaleVertPercent / 100)
            .replace(/#5/, o.moveHorzPts)
            .replace(/#6/, -o.moveVertPts)
            .replace(/#7/, o.rotateDegrees)
            .replace(/#8/, o.rotateDegrees * Math.PI / 180)
            .replace(/#9/, o.numberOfCopies)
            .replace(/#10/, o.transformPointIndex)
            .replace(/#11/, o.scaleStrokes ? 1 : 0)
            .replace(/#12/, o.transformPatterns ? 1 : 0)
            .replace(/#13/, o.transformObjects ? 1 : 0)
            .replace(/#14/, o.reflectX ? 1 : 0)
            .replace(/#15/, o.reflectY ? 1 : 0)
            .replace(/#16/, o.randomize ? 1 : 0);
        LE.applyEffect(item, xml, o.expandAppearance);
    } catch (error) {
        LE.handleError(error);
    }
}

/* -------------------------------------------------------------------------------------------- */
function LE_Tweak(item, options) {
    try {
        var defaults = {
            amountH: 10,
            amountV: 10,
            absoluteness: 0,        /* 0 or false = relative, 1 or true = absolute */
            tweakInPoints: true,
            tweakOutPoints: true,
            tweakAnchorPoints: true,
            expandAppearance: false
        }
        var o = LE.defaultsObject(item, defaults, options, arguments.callee)
        var xml = '<LiveEffect name="Adobe Scribble and Tweak"><Dict data="R horz #1 R vert #2 R ahor #3 R aver #4 R absoluteness #5 B in #6 B out #7 B anch #8 "/></LiveEffect>'
            .replace(/#1/, o.amountH)
            .replace(/#2/, o.amountV)
            .replace(/#3/, o.amountH)
            .replace(/#4/, o.amountV)
            .replace(/#5/, Number(o.absoluteness))
            .replace(/#6/, o.tweakInPoints ? 1 : 0)
            .replace(/#7/, o.tweakOutPoints ? 1 : 0)
            .replace(/#8/, o.tweakAnchorPoints ? 1 : 0);
        LE.applyEffect(item, xml, o.expandAppearance);
    } catch (error) {
        LE.handleError(error);
    }
}

/* -------------------------------------------------------------------------------------------- */
function LE_Twist(item, options) {
    try {
        var defaults = {
            angle: 10,
            expandAppearance: false
        }
        var o = LE.defaultsObject(item, defaults, options, arguments.callee)
        var xml = '<LiveEffect name="Adobe Twirl"><Dict data="R angle #1 "/></LiveEffect>'
            .replace(/#1/, o.angle);
        LE.applyEffect(item, xml, o.expandAppearance);
    } catch (error) {
        LE.handleError(error);
    }
}

/* -------------------------------------------------------------------------------------------- */
function LE_Warp_Arch(item, options) {
    /* example customization of LE_Warp */
    if (options == undefined || typeof options != 'object') options = {};
    options.warpType = 3;
    LE_Warp(item, options);
}

/* -------------------------------------------------------------------------------------------- */
function LE_Warp(item, options) {
    try {
        var defaults = {
            warpType: 0,             /* 0 = Arc, 1 = ArcLower, 2 = ArcUpper, 3 = Arch, 4 = Bulge, 5 = ShellLower,
                                        6 = ShellUpper, 7 = Flag, 8 = Wave, 9 = Fish, 10 = Rise, 11 = FishEye,
                                        12 = Inflate, 13 = Squeeze, 14 = Twist */
            warpAmount: 50,          /* percentage */
            isVertical: false,       /* if true, effect goes on the other axis */
            deformHorizontal: 0,     /* percentage */
            deformVertical: 0,       /* percentage */
            expandAppearance: false
        };
        var o = LE.defaultsObject(item, defaults, options, arguments.callee)
        o.warpName = ['Arc', 'ArcLower', 'ArcUpper', 'Arch', 'Bulge', 'ShellLower', 'ShellUpper', 'Flag', 'Wave', 'Fish', 'Rise', 'FishEye', 'Inflate', 'Squeeze', 'Twist'][o.warpType];
        var xml = '<LiveEffect name="Adobe Deform"><Dict data="S DisplayString Warp:#1 I DeformStyle #2 B Rotate #3 R DeformValue #4 R DeformHoriz #5 R DeformVert #6 "/></LiveEffect>'
            .replace(/#1/, o.warpName)
            .replace(/#2/, o.warpType + 1)
            .replace(/#3/, o.isVertical ? 1 : 0)
            .replace(/#4/, o.warpAmount / 100)
            .replace(/#5/, o.deformHorizontal / 100)
            .replace(/#6/, o.deformVertical / 100);
        LE.applyEffect(item, xml, o.expandAppearance);
    } catch (error) {
        LE.handleError(error);
    }
}

/* -------------------------------------------------------------------------------------------- */
function LE_ZigZag(item, options) {
    try {
        var defaults = {
            amount: 10,
            absoluteness: 1,        /* 0 or false = relative, 1 or true = absolute */
            ridgesPerSegment: 4,
            smoothness: 0,           /* 0 or false = corners, 1 or true = smooth, 0.5 = halfway, 1.5 = too much? */
            expandAppearance: false
        }
        var o = LE.defaultsObject(item, defaults, options, arguments.callee)
        var xml = '<LiveEffect name="Adobe Zigzag"><Dict data="R amount #1 R relAmount #2 R absoluteness #3 R ridges #4 R roundness #5 "/></LiveEffect>'
            .replace(/#1/, o.amount)
            .replace(/#2/, o.amount)
            .replace(/#3/, Number(o.absoluteness))
            .replace(/#4/, o.ridgesPerSegment)
            .replace(/#5/, Number(o.smoothness));
        LE.applyEffect(item, xml, o.expandAppearance);
    } catch (error) {
        LE.handleError(error);
    }
}
