//@include '../scripts/LE_Functions.js'

/*

    There are two test functions:

        1.  LE_TestGeneratedXML()

            This function executes all tests in getTestList() and compares the
            xml result with the expectedXML property of the test list object.

        2.  LE_DemonstrateTests()

            This function executes the functions of all tests in getTestList() in Illustrator,
            showing the result and presenting a confirm dialog between each. This is simply a
            quick way of visually seeing what they do.

*/


/* -------------------------------------------------------------------------------------------- */
function getTestList() {
    /* current tests each function with defaults (empty options) */
    return [
        { func: LE_3DEffect, options: {}, expectedXML: '<LiveEffect name="Adobe 3D Effect"><Dict data="R mat_00 0.9181605881972 R mat_01 0.12903903658077 R mat_02 0.374606542014 R mat_03 0 R mat_10 0.00992534262237 R mat_11 0.93769075518751 R mat_12 -0.3473291453502 R mat_13 0 R mat_20 -0.3960841095717 R mat_21 0.32262203067084 R mat_22 0.85966993868032 R mat_23 0 R mat_30 0 R mat_31 0 R mat_32 0 R mat_33 1 I effectStyle 0 R rotX -22 R rotY -22 R rotZ 8 R cameraPerspective 0 R extrudeDepth 100 R surfaceAmbient 70 I shadeMode 2 I surfaceStyle 3 R surfaceMatte 40 R surfaceGloss 10 R blendSteps 25 B preserveSpots 0 B extrudeCap 1 R revolveAngle 360 R revolveOffset 0 B revolveCap 1 I revolveAxisMode 0 R bevelHeight 4 B bevelExtentIn 1 B shadeMaps 0 B showHiddenSurfaces 0 B invisibleGeo 0 I numArtMaps 0 I 3Dversion 2 B paramsDictionaryInitialized 1 I numLights 1 "><Entry name="shadeColor" valueType="F"><Fill color="5 0 0 0"/></Entry><Entry name="light0" valueType="D"><Dict data="R lightIntensity 1 R lightDirX -0.99 R lightDirY 0 R lightDirZ -1 R lightPosX 0 R lightPosY 0 R lightPosZ -1 " /></Entry><Entry name="DisplayString" value="3D: Bevel & Extrude" valueType="S"/></Dict></LiveEffect>' },
        { func: LE_ConvertToShape, options: {}, expectedXML: '<LiveEffect name="Adobe Shape Effects"><Dict data="U DisplayString Rectangle I Shape 0 R RelWidth 0 R RelHeight 0 R AbsWidth 0 R AbsHeight 0 R Absolute 0 R CornerRadius 9 "/></LiveEffect>' },
        { func: LE_CropMarks, options: {}, expectedXML: '<LiveEffect name="Adobe Trim Marks"><Dict data="I styl 0 "/></LiveEffect>' },
        { func: LE_DropShadow, options: {}, expectedXML: '<LiveEffect name="Adobe Drop Shadow"><Dict data="I blnd 1 R opac 0.75 R horz 7 R vert 7 R blur 5 B usePSLBlur 1 I csrc 0 R dark 100 B pair 1 "><Entry name="sclr" valueType="F"><Fill color="5 0 0 0"/></Entry></Dict></LiveEffect>' },
        { func: LE_Feather, options: {}, expectedXML: '<LiveEffect name="Adobe Fuzzy Mask"><Dict data="R Radius 10 "/></LiveEffect>' },
        { func: LE_FreeDistort, options: {}, expectedXML: '<LiveEffect name="Adobe Free Distort"><Dict data="R src0h 0 R src0v 0 R src1h 1 R src1v 0 R src2h 0 R src2v -1 R src3h 1 R src3v -1 R dst0h 0 R dst0v 0 R dst1h 1.25 R dst1v -0.25 R dst2h 0.25 R dst2v -0.75 R dst3h 0.75 R dst3v -0.75 "/></LiveEffect>' },
        { func: LE_GaussianBlur, options: {}, expectedXML: '<LiveEffect name="Adobe PSL Gaussian Blur"><Dict data="R PrevDocScale 1 I PrevDres 300 R blur 10 "></Dict></LiveEffect>' },
        { func: LE_InnerGlow, options: {}, expectedXML: '<LiveEffect name="Adobe Inner Glow"><Dict data="I blnd 2 I gtyp 0 R opac 0.75 R blur 5 "><Entry name="gclr" valueType="F"><Fill color="5 1 1 1 "/></Entry></Dict></LiveEffect>' },
        { func: LE_OuterGlow, options: {}, expectedXML: '<LiveEffect name="Adobe Outer Glow"><Dict data="I blnd 1 R opac 0.75 R blur 5 B usePSLBlur 1 "><Entry name="sclr" valueType="F"><Fill color="5 0 0 0 "/></Entry></Dict></LiveEffect>' },
        { func: LE_OutlineObject, options: {}, expectedXML: '<LiveEffect name="Adobe Outline Type"><Dict data=" "/></LiveEffect>' },
        { func: LE_OutlineStroke, options: {}, expectedXML: '<LiveEffect name="Adobe Outline Stroke"><Dict data=" "/></LiveEffect>' },
        { func: LE_OffsetPath, options: {}, expectedXML: '<LiveEffect name="Adobe Offset Path"><Dict data="R ofst 10 I jntp 2 R mlim 4 "/></LiveEffect>' },
        { func: LE_PathFinder, options: {}, expectedXML: '<LiveEffect name="Adobe Pathfinder"><Dict data="I Command 0 B ConvertCustom 1 B ExtractUnpainted 1 R Mix 0.5 R Precision 10 B RemovePoints 1 R TrapAspect 1 B TrapConvertCustom 1 R TrapMaxTint 1 B TrapReverse 0 R TrapThickness 0.25 R TrapTint 0.4 R TrapTintTolerance 0.05"><Entry name="DisplayString" value="Add" valueType="S"/></Dict></LiveEffect>' },
        { func: LE_PuckerAndBloat, options: {}, expectedXML: '<LiveEffect name="Adobe Punk and Bloat"><Dict data="R d_factor 50 "/></LiveEffect>' },
        { func: LE_Rasterize, options: {}, expectedXML: '<LiveEffect name="Adobe Rasterize"><Dict data="I colr 4 B alis 0 I dpi. 72 B mask 0 R padd 0 I optn 0 "/></LiveEffect>' },
        { func: LE_Roughen, options: {}, expectedXML: '<LiveEffect name="Adobe Roughen"><Dict data="R asiz 5 R size 5 R absoluteness 0 R dtal 10 R roundness 0 "/></LiveEffect>' },
        { func: LE_RoundCorners, options: {}, expectedXML: '<LiveEffect name="Adobe Round Corners"><Dict data="R radius 10 "/></LiveEffect>' },
        { func: LE_Scribble, options: {}, expectedXML: '<LiveEffect name="Adobe Scribble Fill"><Dict data="R Spacing 5 R Angle 30 R Scribbliness 0.05 R StrokeWidth 3 R EdgeOverlap 0 R ScribbleVariation 0.01 R SpacingVariation 0.5 R EdgeOverlapVariation 5"/></LiveEffect>' },
        { func: LE_SVGFilter, options: {}, expectedXML: '<LiveEffect name="Adobe SVG Filter Effect"><Dict data=""><Entry name="SVGFilterUIDName" value="AI_Alpha_4" valueType="S"/><Entry name="DisplayString" value="AI_Alpha_4" valueType="S"/></Dict></LiveEffect>' },
        { func: LE_Transform, options: {}, expectedXML: '<LiveEffect name="Adobe Transform"><Dict data="R scaleH_Percent 100 R scaleV_Percent 100 R scaleH_Factor 1 R scaleV_Factor 1 R moveH_Pts 0 R moveV_Pts 0 R rotate_Degrees 0 R rotate_Radians 0 I numCopies 0 I pinPoint 4 B scaleLines 0 B transformPatterns 1 B transformObjects 1 B reflectX 0 B reflectY 0 B randomize 0 "/></LiveEffect>' },
        { func: LE_Tweak, options: {}, expectedXML: '<LiveEffect name="Adobe Scribble and Tweak"><Dict data="R horz 10 R vert 10 R ahor 10 R aver 10 R absoluteness 0 B in 1 B out 1 B anch 1 "/></LiveEffect>' },
        { func: LE_Twist, options: {}, expectedXML: '<LiveEffect name="Adobe Twirl"><Dict data="R angle 10 "/></LiveEffect>' },
        { func: LE_Warp, options: {}, expectedXML: '<LiveEffect name="Adobe Deform"><Dict data="S DisplayString Warp:Arc I DeformStyle 1 B Rotate 0 R DeformValue 0.5 R DeformHoriz 0 R DeformVert 0 "/></LiveEffect>' },
        { func: LE_ZigZag, options: {}, expectedXML: '<LiveEffect name="Adobe Zigzag"><Dict data="R amount 10 R relAmount 10 R absoluteness 1 R ridges 4 R roundness 0 "/></LiveEffect>' }
    ];
}


function LE_TestGeneratedXML() {
    /* execute all the functions with default options and check xml result against known output */
    var functionsToTest = getTestList();
    if (functionsToTest == undefined) throw new Error('LE_TestGeneratedXML: getTestList failed.');
    LE.testMode = true;
    LE.testResults = [];
    // fake test item just for XML tests
    var testItem = { typename: 'TestItem' };
    // run the functions
    for (var i = 0; i < functionsToTest.length; i++) {
        functionsToTest[i].func(testItem);
    }
    //check the results
    var failureList = [];
    for (var i = 0; i < LE.testResults.length; i++) {
        LE.testResults[i].pass = LE.testResults[i].xml === functionsToTest[i].expectedXML;
        LE.testResults[i].expected = functionsToTest[i].expectedXML;
        $.writeln('LE.testResults[' + i + '] = ' + LE.testResults[i].functionName + ' ' + (LE.testResults[i].pass ? 'passed.' : 'FAILED!'));
        if (!LE.testResults[i].pass) {
            failureList.push(LE.testResults[i].functionName);
            $.writeln('  generated: ' + LE.testResults[i].xml);
            $.writeln('   expected: ' + functionsToTest[i].expectedXML);
        }
    }
    if (failureList.length > 0) {
        // show failures
        alert('Functions that didn\'t generate identical xml:\n' + (failureList.join('\n')));
    } else {
        alert('All functions passed testing.');
    }
    LE.testMode = false;
}


function LE_DemonstrateTests() {
    /* execute all the functions and see results in illustrator, one after another */
    // must select an PageItem; recommend using a non-rectangular and non-circular pathItem
    var testList = getTestList();
    if (testList == undefined) throw new Error('LE_DemonstrateTests: testList not found.');
    var testItem = app.activeDocument.selection[0];
    if (testItem == undefined) throw new Error('LE_DemonstrateTests: no item selected.');
    for (var i = 0; i < testList.length; i++) {
        testList[i].func(testItem);
        app.redraw();
        doContinue = confirm('(' + i + ')' + testList[i].func.toString());
        if (!doContinue) break;
        app.undo();
        app.redraw();
    }
}

