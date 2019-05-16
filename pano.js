/**
 *
 *  全景解决方案重构
 *  2019.5.15  thinkia
 *
 * */

 let jsonURL = './large-model/space4/VT_Model_info.json ';
 let pathURL = './large-model/space4/path.json ';
 let jsonObj = '';
 let pathObj = '';
 function reqData( complete ) {

     fetch(jsonURL)
         .then( response => response.json())
         .then( data => complete( data ))
         .catch( err => console.log( err ))

 }

 function reqPath( complete ) {

     fetch( pathURL )
         .then( response => response.json())
         .then( data => complete( data ))
         .catch( err => console.log( err ))
 }


 let camera,scene,renderer,control,raycaster=new THREE.Raycaster();
 let curPoint =0 ,historyPoint,targetPoint;

 let targetName = '001';

 let targetTexture ='';

 let loader = new THREE.CubeTextureLoader( );

 let curPos = new THREE.Vector3( 0,0,0 ),targetPos= new THREE.Vector3( 0,0,0 ),historyPos = new THREE.Vector3( 0,0,0 );

 let mat4 = new THREE.Matrix4( );

 let quat = new THREE.Quaternion( );

 let curBox,textInfoGroup=new THREE.Group(),vec3= new THREE.Vector3( 0,0,0 );

 let up = new THREE.Vector3( 0,1,0 );

 let uniforms;
 let uniforms2;
 let cubeText;

 let path = './large-model/space4/512/', format='.jpg';

 let cubeLen = 6;

 let len = cubeLen/2;

 function init() {

     camera = new THREE.PerspectiveCamera( 50,window.innerWidth / window.innerHeight , 0.01,8 );

     scene = new THREE.Scene();

     renderer = new THREE.WebGLRenderer( );

     renderer.setSize( window.innerWidth, window.innerHeight );

     renderer.sortObjects = false;

     control = new THREE.OrbitControls( camera );

     control.target.set( 0,0,-0.1 );
     control.rotateSpeed = -1;

     let cubeGeo  = new THREE.CubeGeometry( cubeLen,cubeLen,cubeLen );
     let cubeGeo2 = new THREE.CubeGeometry( cubeLen,cubeLen,cubeLen );


     cubeText = loader.load(

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

      uniforms2 = {

         U_MainTexture:{ value :  cubeText  },
         alpha:{ value:0.0 }

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

     let cube = new THREE.Mesh(cubeGeo, shaderMaterial);

/*

     let vertices = [];

     // front
     vertices[vertices.length]  =  new THREE.Vector3(-len,len,len);
     vertices[vertices.length]  =  new THREE.Vector3(0,len,len);
     vertices[vertices.length]  =  new THREE.Vector3(len,len,len);
     vertices[vertices.length]  =  new THREE.Vector3(-len,0,len);
     vertices[vertices.length]  =  new THREE.Vector3(0,0,len);
     vertices[vertices.length]  =  new THREE.Vector3(len,0,len);
     vertices[vertices.length]  =  new THREE.Vector3(-len,-len,len);
     vertices[vertices.length]  =  new THREE.Vector3(0,-len,len);
     vertices[vertices.length]  =  new THREE.Vector3(len,-len,len);

     //mid
     vertices[vertices.length]  =  new THREE.Vector3(-len,len,0);
     vertices[vertices.length]  =  new THREE.Vector3(0,len,0);
     vertices[vertices.length]  =  new THREE.Vector3(len,len,0);
     vertices[vertices.length]  =  new THREE.Vector3(-len,0,0);
     vertices[vertices.length]  =  new THREE.Vector3(0,0,0);
     vertices[vertices.length]  =  new THREE.Vector3(len,0,0);
     vertices[vertices.length]  =  new THREE.Vector3(-len,-len,0);
     vertices[vertices.length]  =  new THREE.Vector3(0,-len,0);
     vertices[vertices.length]  =  new THREE.Vector3(len,-len,0);

     // bot
     vertices[vertices.length]  =  new THREE.Vector3(-len,len,-len);
     vertices[vertices.length]  =  new THREE.Vector3(0,len,-len);
     vertices[vertices.length]  =  new THREE.Vector3(len,len,-len);
     vertices[vertices.length]  =  new THREE.Vector3(-len,0,-len);
     vertices[vertices.length]  =  new THREE.Vector3(0,0,-len);
     vertices[vertices.length]  =  new THREE.Vector3(len,0,-len);
     vertices[vertices.length]  =  new THREE.Vector3(-len,-len,-len);
     vertices[vertices.length]  =  new THREE.Vector3(0,-len,-len);
     vertices[vertices.length]  =  new THREE.Vector3(len,-len,-len);

     cube.geometry.vertices = vertices;

     let faces = [];
     //front
     faces[faces.length] = new THREE.Face3(0,6,8 );
     faces[faces.length] = new THREE.Face3(0,8,2 );

     // back
     faces[faces.length] = new THREE.Face3(26,24,18 );
     faces[faces.length] = new THREE.Face3(26,18,20 );

     //left
     faces[faces.length] = new THREE.Face3(18,24,0 );
     faces[faces.length] = new THREE.Face3(24, 6, 0 );

     // right
     faces[faces.length] = new THREE.Face3(2,8,26 );
     faces[faces.length] = new THREE.Face3(2,26,20 );

     // top
     faces[faces.length] = new THREE.Face3(18,0,2 );
     faces[faces.length] = new THREE.Face3(18,2,20 );

     //bot
     faces[faces.length] = new THREE.Face3(24,26,8 );
     faces[faces.length] = new THREE.Face3(8,6,24 );*/

     //front

  /*   faces[faces.length] = new THREE.Face3(0,3,4 );
     faces[faces.length] = new THREE.Face3(0,4,1 );
     faces[faces.length] = new THREE.Face3(1,4,5 );
     faces[faces.length] = new THREE.Face3(1,5,2 );

     faces[faces.length] = new THREE.Face3(3,6,7 );
     faces[faces.length] = new THREE.Face3(3,7,4 );
     faces[faces.length] = new THREE.Face3(4,7,8 );
     faces[faces.length] = new THREE.Face3(4,8,5 );*/


     let cube2 = new THREE.Mesh(cubeGeo2, shaderMaterial2);


     // cube.scale.x = -1;
     scene.add(cube2);

    // cube2.scale.x = -1;
     scene.add(cube);

     cube2.material.uniforms.alpha.value = 0.0;
     cube.material.uniforms.alpha.value = 1.0;

     scene.add( textInfoGroup );
     curBox = 'cube';

     hideAllText();

     viewText();


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

             hideAllText();
            // intersects[0].object.visible = false;
             let tx =( intersects[0].point.x + curPos.x ) / 2.0 ;
             let ty =( intersects[0].point.y + curPos.y ) / 2.0 ;
             let tz =( intersects[0].point.z + curPos.z ) / 2.0 ;
             targetPos.x   = intersects[0].point.x;
             targetPos.y   = intersects[0].point.y;
             targetPos.z   = intersects[0].point.z;

             historyPoint = curPoint;
             targetPoint = parseInt( intersects[0].object.userData.point );

             targetName = intersects[0].object.userData.num;


            /*       mat4.lookAt( curPos,targetPos,up );


             quat.setFromRotationMatrix( mat4  );

             if(camera.quaternion.y*quat.y<0){
                 quat.x = -quat.x;
                 quat.y = -quat.y;
                 quat.z = -quat.z;
                 quat.w = -quat.w;
             }

             new TWEEN.Tween( camera.quaternion )
                 .to({
                     x:quat.x,
                     y:quat.y,
                     z:quat.z,
                     w:quat.w
                 },1000)
                 .easing(TWEEN.Easing.Linear.None)
                 .start();*/



              loader.load(
                [
                    path + '512_'+targetName+'_5_00' + format, path + '512_'+targetName+'_3_00' + format,
                    path + '512_'+targetName+'_1_00' + format, path + '512_'+targetName+'_6_00' + format,
                    path + '512_'+targetName+'_2_00' + format, path + '512_'+targetName+'_4_00' + format,

                ],( targetTexture)=>{

                      if( cube2.material.uniforms.alpha.value < 0.5 )
                      {
                          cube2.material.uniforms.U_MainTexture.value = targetTexture;
                          curBox = 'cube2';
                      }else
                      {
                          cube.material.uniforms.U_MainTexture.value = targetTexture;
                          curBox = 'cube';
                      }


                      new TWEEN.Tween(camera.position)
                          .to( {
                              x:tx - 1e-6,
                              y:ty - 1e-6,
                              z:tz - 1e-6
                          } , 800)
                          .easing( TWEEN.Easing.Linear.None)
                          .onUpdate( xhr=>{


                              control.target.set(
                                  xhr.x + camera.getWorldDirection( vec3 ).x*1e-6 ,
                                  xhr.y + camera.getWorldDirection( vec3 ).y*1e-6,
                                  xhr.z + camera.getWorldDirection( vec3 ).z*1e-6,
                              )
                              let distance = intersects[0].point.distanceTo( xhr )

                              if( curBox ==='cube2' )
                              {

                                  cube2.position.set(xhr.x,xhr.y,xhr.z,);
                                  cube.material.uniforms.alpha.value = distance/intersects[0].distance ;
                                  cube2.material.uniforms.alpha.value = 1.0 - distance/intersects[0].distance;

                              }else
                              {
                                  cube.position.set(xhr.x,xhr.y,xhr.z,);
                                  cube2.material.uniforms.alpha.value = distance/intersects[0].distance ;
                                  cube.material.uniforms.alpha.value = 1.0 -distance/intersects[0].distance;

                              }

                          } )
                          .onComplete( ()=>{
                              console.log(cube.position);

                              if(curBox ==='cube2' )
                              {
                                  new TWEEN.Tween( cube.position)
                                      .to({
                                      x:tx,
                                      y:ty,
                                      z:tz
                                    },400)
                                      .easing( TWEEN.Easing.Linear.None)
                                      .onUpdate( xhr=>{

                                      })
                                      .start();
                              }else
                              {
                                  new TWEEN.Tween( cube2.position)
                                      .to({
                                          x:tx,
                                          y:ty,
                                          z:tz
                                      },400)
                                      .easing( TWEEN.Easing.Linear.None)
                                      .onUpdate( xhr=>{

                                      })
                                      .start();
                              }

                              new TWEEN.Tween(camera.position)
                                  .to( {
                                      x:targetPos.x - 1e-6,
                                      y:targetPos.y - 1e-6,
                                      z:targetPos.z - 1e-6
                                  } , 400)
                                  .easing( TWEEN.Easing.Linear.None)
                                  .onUpdate( xhr=>{

                                      control.target.set(
                                          xhr.x + camera.getWorldDirection( vec3 ).x*1e-6,
                                          xhr.y + camera.getWorldDirection( vec3 ).y*1e-6,
                                          xhr.z + camera.getWorldDirection( vec3 ).z*1e-6,
                                      )
                                      let distance = intersects[0].point.distanceTo( xhr )

                                      if( curBox ==='cube2' )
                                      {
                                          cube2.position.set(xhr.x,xhr.y,xhr.z,);
                                          cube.material.uniforms.alpha.value = distance/intersects[0].distance ;
                                          cube2.material.uniforms.alpha.value = 1.0 -  distance/intersects[0].distance ;
                                      }else
                                      {
                                          cube.position.set(xhr.x,xhr.y,xhr.z,)
                                         // cube2.position.set(xhr.x/2 -tx,xhr.y/2 - tx,xhr.z/5,);
                                          cube2.material.uniforms.alpha.value = distance/intersects[0].distance ;
                                          cube.material.uniforms.alpha.value = 1.0 -distance/intersects[0].distance;
                                      }

                                  } )
                                  .onComplete( ()=>{

                                      if( curBox ==='cube2' )
                                          cube.position.set(camera.position.x,camera.position.y,camera.position.z,);
                                      else
                                          cube2.position.set(camera.position.x,camera.position.y,camera.position.z,);


                                      curPos.copy( targetPos );
                                      curPoint = targetPoint;

                                      lookAtCamera();

                                      viewText();

                                  })
                                  .start();

                          } )
                          .start();

                }
            );


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

 function lookAtCamera() {

     if( !textInfoGroup || !camera ) return ;

     for( let i=0;i<textInfoGroup.children.length;i++)
     {
         textInfoGroup.children[i].lookAt( camera.position );
     }

 }

 function hideAllText() {
     if( !textInfoGroup ) return ;
     for( let i=0;i<textInfoGroup.children.length;i++)
     {
         textInfoGroup.children[i].visible =false;
     }
 }

 function viewText() {

     if(!pathObj  || !jsonObj  ) return ;

     for(let i = 1 ;i< jsonObj.transform[0].length+1;i++)
     {
         if(pathObj.autoPath[curPoint+1][i] )
         {
             if( pathObj.autoPath[curPoint+1][i].length ==2 )
                 textInfoGroup.children[pathObj.autoPath[curPoint+1][i][1] -1 ].visible = true;
         }
     }

 }

 function showAllText() {
     if( !textInfoGroup ) return ;
     for( let i=0;i<textInfoGroup.children.length;i++)
     {
         textInfoGroup.children[i].visible =true;
     }

 }


 function animate() {

    TWEEN.update();

    rend();
    requestAnimationFrame( animate );

 }



 reqData( data=>{

     jsonObj = data;

     reqPath( pathData =>{

         pathObj = pathData;


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
                     num:`${j+1}`.padStart(3,'0'),
                     name:jsonObj.name,
                     point:`${j}`,
                 };

                 textInfoGroup.add(plane);

             }

         }

         init();

     })

 } );



