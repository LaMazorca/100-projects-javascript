const DECISION_THRESHOLD = 80; //minimum distance to take a decision
let isAnimating = false;
let pullDeltaX = 0; //distance of the card pulled

function startDrag (event) {
    if (isAnimating) return;

    //get the first article element
    const actualCard = event.target.closest('article');
    if(!actualCard) return;

    //get initial position of mouse or finger
    const startX = event.pageX ?? event.touches[0].pageX;

    // listen the mouse and touch movements
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);

    document.addEventListener('touchmove', onMove, {passive: true});
    document.addEventListener('touchend', onEnd, {passive: true});

    function onMove (event) {
        // current position of mouse or finger
        const currentX = event.pageX ?? event.touches[0].pageX;
    
        //the distance between the initial and current position
        pullDeltaX = currentX - startX;
    
        //no distance, no movement
        if(pullDeltaX === 0) return;

        // change the flag to indicate we are animating
        isAnimating = true;

        // calculate the rotation of the card using the distance
        const deg = pullDeltaX / 15;

        //apply the transformation to the card
        actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`;

        // change the cursor to grabbing
        actualCard.style.cursor = 'grabbing';

        //change opasity of the choice info
        const opacity = Math.abs(pullDeltaX) / 100;
        const goRigth = pullDeltaX >= 0;
        const goLeft = !goRigth;
        const choiceEl = goRigth ? actualCard.querySelector('.choice.like') : actualCard.querySelector('.choice.nope');

        choiceEl.style.opacity = opacity;
    }
    
    function onEnd (event) {
        // remove the listeners
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);

        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);

        //is take a decision
        const decisionMade = Math.abs(pullDeltaX) >= DECISION_THRESHOLD;

        if(decisionMade){
            const goRigth = pullDeltaX >= 0;
            const goLeft = !goRigth;

            //add class according to the decision
            actualCard.classList.add(goRigth ? 'go-right' : 'go-left');
            actualCard.addEventListener('transitionend', () => {
                actualCard.remove();
            });
        }else{
            actualCard.classList.add('reset');
            actualCard.classList.remove('go-right', 'go-left');
            actualCard.querySelectorAll('.choice').forEach(choice => choice.style.opacity = 0);
        }

        //reset the variables
        actualCard.addEventListener('transitionend', () => {
            actualCard.removeAttribute(`style`);
            actualCard.classList.remove('reset');
            isAnimating = false;
            pullDeltaX = 0;
        });
    }
}

document.addEventListener('mousedown', startDrag);
document.addEventListener('touchstart', startDrag, {passive: true});