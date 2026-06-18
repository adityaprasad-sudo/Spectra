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

- THREE JS

1. lets first load the 3D model in blender and try to set pivots on which  each door will rotate follow the steps below :-

   load the model
   ![Load model](https://github.com/adityaprasad-sudo/Spectra/blob/ccd8bd335191e66cb06b582793fd7502774438eb/tutorial%20images/fileupload.png?raw=true)
   Choose the file format depending on your model ( eg :- if your file format is .gltf/.glb then choose .gltf 2.0 )
2. Part selecting

   now there could be two case :- 
   
   case-I: The whole car body is welded ie you cant select a part like door distinctively, this is the way to seperate them:-
   ![case-1 expample](https://github.com/adityaprasad-sudo/Spectra/blob/ccd8bd335191e66cb06b582793fd7502774438eb/tutorial%20images/weldeddoor.png?raw=true) this is an example

   steps to seperate them
   ![case-1 expample](https://github.com/adityaprasad-sudo/Spectra/blob/ccd8bd335191e66cb06b582793fd7502774438eb/tutorial%20images/Screenshot%202026-06-18%20174100.png?raw=true)
   ![case-1 expample](https://github.com/adityaprasad-sudo/Spectra/blob/ccd8bd335191e66cb06b582793fd7502774438eb/tutorial%20images/Screenshot%202026-06-18%20174100.png?raw=true)



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
