/**
 *
 *  全景解决方案重构
 *  2019.5.15  thinkia
 *
 * */

 let jsonURL = './large-model/space4/VT_Model_info.json ';
 let jsonObj = '';
 function reqData( complete ) {

     fetch(jsonURL)
         .then( response => response.json())
         .then( data => complete( data ))
         .catch( err => console.log( err ))

 }

 let camera,scene,renderer,control,raycaster=new THREE.Raycaster();
 let curPoint =0 ,historyPoint,targetPoint;
 let curBox,textInfoGroup=new THREE.Group(),vec3= new THREE.Vector3( 0,0,0 );

 let uniforms;
 let uniforms2;
 let cubeText;

 let path = './large-model/space4/512/', format='.jpg';


 function init() {

     camera = new THREE.PerspectiveCamera( 50,window.innerWidth / window.innerHeight , 0.01,6.1 );

     scene = new THREE.Scene();

     renderer = new THREE.WebGLRenderer( );

     renderer.setSize( window.innerWidth, window.innerHeight );

     renderer.sortObjects = false;

     control = new THREE.OrbitControls( camera );

     control.target.set( 0,0,-0.1 );
     control.rotateSpeed = -1;

     let cubeGeo  = new THREE.CubeGeometry( 6,6,6 );
     let cubeGeo2 = new THREE.CubeGeometry( 6,6,6 );

     cubeText = new THREE.CubeTextureLoader( ).load(

         [
             path + '512_001_5_00' + format, path + '512_001_3_00' + format,
             path + '512_001_1_00' + format, path + '512_001_6_00' + format,
             path + '512_001_2_00' + format, path + '512_001_4_00' + format,
         ]

     );


     uniforms = {
         U_MainTexture: { value: cubeText },
         alpha:{ value: 1.0 }
     };

     let shaderMaterial = new THREE.ShaderMaterial(
         {
             side: THREE.BackSide,
             // side:THREE.DoubleSide,
             uniforms: uniforms,
             vertexShader: document.getElementById('vertexshader').textContent,
             fragmentShader: document.getElementById(('fragmentshader')).textContent,
             depthTest: false,
             transparent: true
         });

     let uniforms2 = {

         U_MainTexture:{ value :  cubeText  },
         alpha:{ value:1.0 }

     };

     var shaderMaterial2 = new THREE.ShaderMaterial(
         {
             side: THREE.BackSide,
             // side:THREE.DoubleSide,
             uniforms: uniforms2,
             vertexShader: document.getElementById('vertexshader').textContent,
             fragmentShader: document.getElementById(('fragmentshader')).textContent,
             depthTest: false,
             transparent: true

         });

     var cube = new THREE.Mesh(cubeGeo, shaderMaterial);
     var cube2 = new THREE.Mesh(cubeGeo2, shaderMaterial2);

     // cube.scale.x = -1;
     scene.add(cube2);

    // cube2.scale.x = -1;
     scene.add(cube);

     cube2.material.uniforms.alpha.value = 0.0;
     cube.material.uniforms.alpha.value = 1.0;

     scene.add( textInfoGroup );
     curBox = 'cube';

     console.log( textInfoGroup );

     textInfoGroup.children[curPoint].visible = false;

     document.getElementById('WebGL-output').appendChild(renderer.domElement);

     document.getElementById('WebGL-output').addEventListener('click',( event )=>{

         let mouse = {
             x:( event.clientX / window.innerWidth )*2 -1,
             y: -( event.clientY / window.innerHeight )*2 +1
         }

         raycaster.setFromCamera( mouse,camera );

         let intersects = raycaster.intersectObjects( textInfoGroup.children );
         if( intersects.length > 0)
         {
             console.log( intersects[0] );
         }

     })

     animate();

 }

 function rend() {

    control.update();
    renderer.render(scene, camera);

}

 function getTextPlan({textInfo, planSize = 0.1, depthTest = false, numLength}) {

    // 画布单位长度，根据文字数量调整大小
    let canvasUnitSize = 128;
    // 圆角矩形角度像素值
    let cornerRadius = 28;
    // 文字数量，用于后续计算
    let textLength = numLength || textInfo.length;
    // 圆角矩形背景缩放值，太大会显得文字两边很空
    let scale = 0.2;
    let canvas = document.createElement("canvas");
    canvas.width = canvasUnitSize * textLength ;
    canvas.height = canvasUnitSize;
    var ctx = canvas.getContext("2d");

    // 渲染圆角矩形
    ctx.fillStyle = 'rgba(0,0,0, 0.5)';
    ctx.strokeStyle = 'rgba(0,0,0, 0.5)';
    ctx.lineJoin = "round";
    ctx.lineWidth = cornerRadius;

    ctx.strokeRect(
        canvas.width * scale+(cornerRadius/2),
        cornerRadius/2,
        canvas.width * (1-scale)-cornerRadius,
        canvas.height-cornerRadius);

    ctx.fillRect(
        canvas.width * scale+(cornerRadius),
        cornerRadius,
        canvas.width * (1-scale)-cornerRadius*2,
        canvas.height-cornerRadius*2);

    // 设置文字
    ctx.font = `${parseInt(canvasUnitSize * 0.6)}px '微软雅黑'`;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.fillText(textInfo, canvas.width * (0.5 + scale / 2), canvasUnitSize * 0.75);

    // 创建平面几何体
    let planGeo = new THREE.PlaneBufferGeometry(planSize * textLength, planSize);
    let planMat = new THREE.MeshBasicMaterial({
        opacity: 1,
        transparent: true,
        blending: THREE.CustomBlending,
        depthWrite:false,
        depthTest: depthTest,
        map: (new THREE.CanvasTexture(canvas))
    });
    return (new THREE.Mesh(planGeo, planMat));

}


 function animate() {

  //  TWEEN.update();

    rend();
    requestAnimationFrame( animate );

 }



 reqData( data=>{

     console.log( data );
     jsonObj = data;
     for( let i= 0 ;i< jsonObj.transform.length;i++)
     {
         for( let j=0;j< jsonObj.transform[i].length; j++)
         {
            let plane = getTextPlan( {
                textInfo:`${j+1}`,
            });

            plane.position.set(
                jsonObj.transform[i][j].matrix[3] - jsonObj.transform[0][0].matrix[3],
                jsonObj.transform[i][j].matrix[7] - jsonObj.transform[0][0].matrix[7],
                jsonObj.transform[i][j].matrix[11] - jsonObj.transform[0][0].matrix[11],
            );

            plane.lookAt( 0,0,0 );
            plane.userData = {
                num:`00${j+1}`,
                name:jsonObj.name
            };

            textInfoGroup.add(plane);

         }

     }

     init();
 } );



