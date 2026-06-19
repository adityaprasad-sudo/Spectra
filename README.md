# Three JS Car Showcase

Just built this out of curiosity to give my three js skills a push and to test them. Also test my blender skills ( Not very good 🥹)

This project features three car models with the carparts such as doors, bonnet, trunk, etc are animated purely in javascript (Three js).

I tried my best to optimize the webpage as much as possible such as by avoiding realtime shadows since for the shadows i have used baked shadows BUT even if the Device is not capable enough i have added an option to turn the graphic settings down ; )  

# What I used

Well i did use a lot of stuff but here are the common ones
- Blender (**Very important** without this i couldnt have made the webpage)
- Three JS (**Most important** Took a lot of time to implement the car model and the enviorment with the lighting )
- Documentation ( Three js bible [almost made me cry😭] )
- 3D models ( Any model is fine since i will explain how to make the models work )
- HTML/CSS (do i need to explain why this is needed)
- Basic Blender SKills
- Maths
- Coffee

## Getting Started

Welcome to hell sorry for my messy code :(

### Dependencies

- **THREE JS**

# Blender Part

1. lets first load the 3D model in blender and try to set pivots on which  each door will rotate follow the steps below :-

   **load the model**
   ![Load model](https://github.com/adityaprasad-sudo/Spectra/blob/ccd8bd335191e66cb06b582793fd7502774438eb/tutorial%20images/fileupload.png?raw=true)
   Choose the file format depending on your model ( eg :- if your file format is .gltf/.glb then choose .gltf 2.0 )
2. **Part selecting**

   now there could be two case :- 
   
   case-I: The whole car body is welded ie you cant select a part like door distinctively, this is the way to seperate them:-
   ![case-1 expample](https://github.com/adityaprasad-sudo/Spectra/blob/ccd8bd335191e66cb06b582793fd7502774438eb/tutorial%20images/weldeddoor.png?raw=true) **this is an example**

   -------------------------------------------------------------------

   ### steps to seperate them
   ![editmode](https://github.com/adityaprasad-sudo/Spectra/blob/ccd8bd335191e66cb06b582793fd7502774438eb/tutorial%20images/Screenshot%202026-06-18%20174100.png?raw=true)
   ![seperating](https://github.com/adityaprasad-sudo/Spectra/blob/main/tutorial%20images/Screenshot%202026-06-18%20174147.png?raw=true)
   ![result](https://github.com/adityaprasad-sudo/Spectra/blob/main/tutorial%20images/Screenshot%202026-06-18%20174240.png?raw=true)

   **If The door is already seprated you can directly jump to joining all the door parts or whatever you are trying to animate eg doors trunk etc.**

   **VERY IMPORTANT:- After the door parts have been seperated select all the parts asscoiate with the door and press CTRL+J to jion them ie combine them to form a single element below is a more clearer image of what i mean**

   ![doorselect](https://github.com/adityaprasad-sudo/Spectra/blob/main/tutorial%20images/Screenshot%202026-06-18%20174430.png?raw=true)

   **After That hit TAB to enter edit mode again and fix the pivot at a fake hinge point or for more realism fix it at a hinge midpoint below is a more detailed image**

   ![fakepivot](https://github.com/adityaprasad-sudo/Spectra/blob/main/tutorial%20images/Screenshot%202026-06-18%20175209.png?raw=true)
   ![fakepivot](https://github.com/adityaprasad-sudo/Spectra/blob/main/tutorial%20images/Screenshot%202026-06-18%20175302.png?raw=true)
   ![fakepivot](https://github.com/adityaprasad-sudo/Spectra/blob/main/tutorial%20images/Screenshot%202026-06-18%20175359.png?raw=true)
   

   **The Above steps is to create a fake pivot point it doesnt look that bad** 

   **to create a more relaistic door pivot follow the steps below**
   **Very IMPORTANT First find your Hinge mesh**

   ![hingemesh](https://github.com/adityaprasad-sudo/Spectra/blob/main/tutorial%20images/Screenshot%202026-06-18%20175548.png?raw=true)

   after finding the hinge mesh go into edit mode and select all the face of it **from above**

   ![hingemesh](https://github.com/adityaprasad-sudo/Spectra/blob/main/tutorial%20images/Screenshot%202026-06-18%20175645.png?raw=true)

   then press F to form a single circular mesh and select it

   ![hingemesh](https://github.com/adityaprasad-sudo/Spectra/blob/main/tutorial%20images/Screenshot%202026-06-18%20175652.png?raw=true)

   if you cant select the face first go into the face mode from here

   ![hingemesh](https://github.com/adityaprasad-sudo/Spectra/blob/main/tutorial%20images/Screenshot%202026-06-18%20175708.png?raw=true)

   after selecting Press Shift+S to open up the quick menu and then press **Cursor to Active**

   ![hingemesh](https://github.com/adityaprasad-sudo/Spectra/blob/main/tutorial%20images/Screenshot%202026-06-18%20175746.png?raw=true)

   After that you would be able to see the cursor in the middle of the hinge

   ![hingemesh](https://github.com/adityaprasad-sudo/Spectra/blob/main/tutorial%20images/Screenshot%202026-06-18%20175819.png?raw=true)

3. Final step to **map the pivot of the door to the cursor**

   After placing the cursor on your desired position you would have to click on the doot but make you are in the select mode(should not be in cursor mode) otherwise the cursor will shift whereever you click on. 
   
   After clicking the door **Right Click** it and click **set origin to** and then **origin to 3d cursor** 

   ![hingemesh](https://github.com/adityaprasad-sudo/Spectra/blob/main/tutorial%20images/Screenshot%202026-06-18%20175359.png?raw=true)

**And thats it now if you rotate the door around z axis it should rotate about the hinge or wherever you previously placed your 3D cursor at. You can repeate the same steps to pivot the remaining doors, bonnet, trunk etc. Since animation part is handeled in THREE JS** 

---

# The Code

Here I will explain the things i used to optimize and the parts that took me long to figure out.

1. lighting and Enviourment:- To make the lighting as realistic as possibly i used a dome ground projection setup basically i wrapped a 4k resolution hdri in a dome and by adjusting the radius and height of the dome i was able to produce a good quality floor and enviourment.

```const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
const gen = new PMREMGenerator(renderer);
gen.compileEquirectangularShader();
const oaderchig= new RGBELoader(manager);
let skybox; // 
oaderchig.load('./hdris/hrdi.hdr', (texture) => {
    const envmap = gen.fromEquirectangular(texture).texture;
    scene.environment = envmap;
    scene.environmentIntensity = 1.2;
    skybox = new GroundProjectedSkybox(texture);
    skybox.scale.setScalar(100)
    skybox.radius = 70
    skybox.height = 10
    scene.add(skybox);
    texture.dispose();
})
```
The above is the whole dome with hdri setup, i have used GroundProjectSkybox constructor to build a new dome if you zoom out it looks like a sphere but if we adjust the height it adds a floor inside the cube adjusting the height also adjusts the radius of the floor ( inside the sphere ) 

**NOTE**:- the **skybox.radius only affects the radius of the floor** while skybox.scale.setScalar affects the whole sphere ie you can also shape it like a oval elliptical structure since the **scale.setScalar(X,Y,Z)** but if you specify scale.setScalar(100) it gives a perfect sphere with radius 100.

**File Formats**

1. if you have an **.exr** file then use `EXRLoader()` and import `import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';`  

2. If you have an **.hdri** file then use `RGBELoader()` and import `import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';`

**Rendering**

As of now **I am using webgl instead of webgpu** since webgpu is a newer tech and requires updated browers and **webgpu might not work correctly on all devices** especially the older ones.

To initialize WebGL use `const renderer = new THREE.WebGLRenderer({ antialias: true });`
we are using `antialias:true` to smooth out the edges of the 3D Model

To initialize WebGPU use `const renderer = new THREE.WebGPURenderer({ antialias: true });` and import `import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer.js';`

Now, after creating a raw scene using the renderers we pass it thorugh the **effect composer** to add effects like bloom it looks good but try to find a sweet spot because too much bloom doesnt look good and too little has no effect on the scene

**NOTE:-** Also I have found that when using the webgl renderer it tends to overbrigthen the bright parts of the scene to avoid that use `renderer.toneMapping = THREE.ACESFilmicToneMapping` and adjust the exposure by `renderer.toneMappingExposure = 1`

**Shadows**

This is very tricky because if you use real time shadows the frame rates would drop drastically like i was getting 55-60 without the shadows and with the shadows enabled it drops to 25-30
so instead of using real time shadows we will bake the shadows in blender and use the .png file from there to use as a floor in our project
I have given the dome.blend file just open it and follow these instructions to make its shadow map:-

**STEPS TO MAKE SHADOW MAP**

1. first import you desired model into the .blend file in blender 

![import](https://github.com/adityaprasad-sudo/Spectra/blob/main/tutorial%20images/fileimpo.png?raw=true) 

2. If the render engine is set to eevee change it to cycles also you can switch from CPU to GPU compute if you have a good dedicated gpu it can drastically improve performance

![import](https://github.com/adityaprasad-sudo/Spectra/blob/main/tutorial%20images/render.png?raw=true)

**NOTE**:- if you want to see how the shadow looks switch to rendered view by clicking the water bubble typa thing in the top right of the viewport.

3. select the floor mesh and the image node of the floor in the shader editor 

![import](https://github.com/adityaprasad-sudo/Spectra/blob/main/tutorial%20images/meshselct.png?raw=true)

4. Click the Bake button to bake the shadows and get a png file

![import](https://github.com/adityaprasad-sudo/Spectra/blob/main/tutorial%20images/bakedimage.png?raw=true)

5. save the baked shadow as a png

![import](https://github.com/adityaprasad-sudo/Spectra/blob/main/tutorial%20images/imagesave.png?raw=true)

**How to use the bakedshadow.png in your project**

To use different shadow maps for different cars we use this custom floor code that automatically removes the white background from the baked shadows and allows us to adjust its alpha value to make the shadows more darker or lighter for instance if you increase the aplha the shadows become darker and lowering the alpha makes the shadows lighter 

**NOTE**:- I have taken help from AI to make this peice of code

```
            const texsha = new THREE.TextureLoader(manager).load('./shadowmaps/astonshadow.png'); //loadingthe shadow.png and using it as a the texture of the floor and change the png file accordingly
            const geosha = new THREE.PlaneGeometry(6.5, 10); //ajust this accordingly if you car is bigger make this value bigger 6.5 is the length and 10 is the width of the plane in this case
            const matsha = new THREE.ShaderMaterial({
                transparent: true,
                depthWrite: false,
                uniforms:{
                    tDiffuse:{value:texsha},
                    shadowColor:{value: new THREE.Color(0x000000)}
                },
                vertexShader:`
                    varying vec2 vUv;
                    void main(){
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }`,
                fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform vec3 shadowColor;
                varying vec2 vUv;
                void main(){
                    vec4 tex = texture2D(tDiffuse, vUv);
                    float alpha = 1.0 - tex.r;
                    gl_FragColor = vec4(shadowColor, alpha*0.99); // adjust the alpha here to make the shadows darker or brighter
                }`
            })
```
Paste it in every car block you are making or using also dont forget to change the png file for different cars





## Help

Any advise for common problems or issues.
```
command to run if program contains helper info
```

## Authors

Contributors names and contact info

ex. Dominique Pizzie  
ex. [@DomPizzie](https://twitter.com/dompizzie)

## Version History

* 0.2
    * Various bug fixes and optimizations
    * See [commit change]() or See [release history]()
* 0.1
    * Initial Release
