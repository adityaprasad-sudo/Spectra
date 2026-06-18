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




### Installing

* How/where to download your program
* Any modifications needed to be made to files/folders

### Executing program

* How to run the program
* Step-by-step bullets
```
code blocks for commands
```

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
