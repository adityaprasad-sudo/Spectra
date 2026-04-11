const apibse = 'http://127.0.0.1:8000/'
mealbtn.addEventListener('click', async (e) => {
    e.preventDefault();
    if(ingrediants.value.trim() === '') {
        ingrediants.style.borderColor = '#c0392b';
        setTimeout(() => ingrediants.style.borderColor = '#ccc', 2000);
        return;
    }
    const selectedgoals = [...document.querySelectorAll('.pill.active')].map(pill => pill.innerText);
    mealbtn.disabled = true;
    mealbtn.innerText = 'Consulting Chef...';
    mealspin.classList.remove('hidden');
    mealout.innerHTML = '';

    try{
        const response = await fetch(`${apibse}meal`, {
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
        if(!response.ok){
            const err = await responce.json();
            throw new Error(err.error);
        }
        const data = await response.json();
        const mealplan = data.mealplan;
        mealout.style.padding = '20px';
        mealout.style.background = 'white';
        mealout.style.borderRadius = '12px';
        mealout.style.marginTop = '20px';
        mealout.style.whiteSpace = 'pre-line';
        mealout.style.border = '1px solid css';
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