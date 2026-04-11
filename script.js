const apibse = 'http://127.0.0.1:8000/'
const ingrediants = document.getElementById('ingrediants');
const mealbtn = document.getElementById('mealbtn');
mealbtn.addEventListener('click', async (e) => {
    e.preventDefault();
    if(ingrediants.value.trim() === '') {
        ingrediants.style.borderColor = '#c0392b';
        setTimeout(() => ingrediants.style.borderColor = '#ccc', 2000);
        return;
    }
    const activepill = document.querySelectorAll('.pill.active');
const goals = Array.from(activepill).map(pill => pill.innerText);
mealspin.classList.remove('hidden');
try {
         const responce = await fetch(`${apibse}/meal`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ingredients: ingredients,
                days: days,
                goal: goals.length > 0 ? goals : null 
            })
        });

        if (!responce.ok) {
            const errData = await responce.json();
            throw new Error(errData.detail || 'Failed to generate meal plan');
        }

        const data = await responce.json();
        
        // Display the result (replace line breaks with HTML <br> tags so it formats nicely)
        mealout.innerHTML = data.mealplan.replace(/\n/g, '<br>');

       } catch (error) {
        console.error("Error:", error);
        mealerr.innerText = "Error generating meal plan. Check console.";
        } finally {
        // Hide loading spinner
        mealspin.classList.add('hidden');
     }
    const selectedgoals = [...document.querySelectorAll('.pill.active')].map(pill => pill.innerText);
    mealbtn.disabled = true;
    mealbtn.innerText = 'Consulting Chef..';
    mealspin.classList.remove('hidden');
    mealout.innerHTML = '';

    try{
        const responce = await fetch(`${apibse}meal`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ingredients: ingrediants.value,
                days: parseInt(days.value),
                goals: selectedgoals
            })
        });
        if(!responce.ok){
            const err = await responce.json();
            throw new Error(err.error);
        }
        const data = await responce.json();
        const mealplan = data.mealplan;
        mealout.style.padding = '20px';
        mealout.style.background = 'white';
        mealout.style.borderRadius = '12px';
        mealout.style.marginTop = '20px';
        mealout.style.whiteSpace = 'pre-line';
        mealout.style.border = '1px solid #ccc';
        let i = 0 ;
        function type(){
            if (i < mealplan.length) {
                mealout.innerHTML += mealplan.charAt(i);
                i++;
                setTimeout(type, 20);
            }
        }
        type();
    } catch (err) { mealout.innerHTML = `<p style="color:red;padding:16px">${err.message}</p>`;}
    finally{ mealspin.classList.add('hidden'); mealbtn.innerText = 'Generate Meal Prep planner'; mealbtn.disabled = false; }
});
photobtn.addEventListener('click', ()=> {
    hiddenFileInput.click();
});
hiddenFileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    photobtn.innerText = 'Analyzing';
    mealspin.classList.remove('hidden');
    try {
        const url = await new Promise((resolve,reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('file read err'));
            reader.readAsDataURL(file);
        });
        const [meta, base64] = url.split(',');
        const mimetype = meta.split(';')[0].split(':')[1];
        const responce = await fetch(`${apibse}image`, { method: 'POST', headers:{ 'Content-Type': 'application/json' },
        body: JSON.stringify({imagebase64: base64, imtype: mimetype })
        });
        if(!responce.ok) throw new Error('imgae analysis failed');
        const data = await responce.json();
        const detected = data.ingredients;
        const current = ingrediants.value.trim();
        ingrediants.value = current ? `${current}, ${detected}` : detected;
        
    } catch  (err) {
        alert(`coulnt analyze photo: ${err.message}`)
    } finally{
        photobtn.innerText = 'Take Photo';
        mealspin.classList.add('hidden');
    }
});
const containergoal = document.getElementById('goal');
    if (containergoal) {
        const goalsList = ['Weight Loss', 'Muscle Gain', 'Maintenance', 'High Protein', 'Vegan'];
        goalsList.forEach(goal => {
            const pill = document.createElement('button');
            pill.className = 'pill';
            pill.innerText = goal;
            pill.addEventListener('click', (e) => {
                e.preventDefault(); 
                pill.classList.toggle('active');
            });
            containergoal.appendChild(pill);
        });
    }
    

const daslide = document.getElementById('days');
const dadays = document.getElementById('days-display'); 
    
    if (daslide && dadays) {
        dadays.innerText = daslide.value;
        daslide.addEventListener('input', (e) => {
            dadays.innerText = e.target.value;
        });
    }
   
const barbtn = document.querySelector('.barcode');
const overlay = document.getElementById('scanner');
const closebtn = document.getElementById('scanclose');
    let html5QrCode;

    if (barbtn && overlay && closebtn) {
        barbtn.addEventListener('click', (e) => {
            e.preventDefault();
            overlay.classList.add('active');
            
            try {
                if (typeof Html5Qrcode !== "undefined") {
                    html5QrCode = new Html5Qrcode("reader");
                    html5QrCode.start(
                        { facingMode: "environment" }, 
                        { fps: 10, qrbox: { width: 250, height: 250 } },
                        (decodedText) => {
    html5QrCode.stop().then(async () => {
        overlay.classList.remove('active');
        try {
            const responce = await fetch(`${apibse}/barcode`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ barcode: decodedText })
            });
            if (!responce.ok) throw new Error('Product not found');

            const product = await responce.json();

            const label   = product.brand
                ? `${product.brand} ${product.name}`
                : product.name;

            ingredientsInput.value +=
                (ingredientsInput.value ? ', ' : '') + label;

        } catch (err) {
            alert(`barcode lookup failed: ${err.message}`);
        }
    });

                        },
                        (errorMessage) => {}
                    ).catch(err => {
                        alert("Camera access denied. Simulating scan.");
                        overlay.classList.remove('active');
                        ingredientsInput.value += (ingredientsInput.value ? ", " : "") + "Protein Bar";
                    });
                } else {
                    alert("scanner is loading");
                }
            } catch (error) {
                console.error(error);
            }
        });

        closebtn.addEventListener('click', () => {
            if (html5QrCode) {
                html5QrCode.stop().then(() => overlay.classList.remove('active')).catch(() => overlay.classList.remove('active'));
            } else {
                 overlay.classList.remove('active');
            }
        });
    }    