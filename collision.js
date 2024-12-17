export function checkCollision(plane, rocks, ground) {
    return checkCeinligCollision(plane)
    || checkGroudCollision(plane, ground)
    || checkRockCollision(plane, rocks);
}

function checkCeinligCollision(plane) {
    return plane.y - plane.hitboxHeight / 2 <= 0;
}

function checkGroudCollision(plane, ground) {
    return plane.y + plane.hitboxHeight / 2 >= ground.y;
}

function checkRockCollision(plane, rocks) {
    return rocks.some(rock =>
        checkTopRockCollision(plane, rock) ||
        checkBottomRockCollision(plane, rock) 
    );
}

function checkTopRockCollision(plane, rock) {
    return plane.y - plane.hitboxHeight / 2 < rock.top &&
    plane.x - plane.hitboxWidth / 2 < rock.x + rock.width &&
    plane.x - plane.hitboxWidth / 2 > rock.x;
}

function checkBottomRockCollision(plane, rock) {
    return plane.y + plane.hitboxHeight / 2 > rock.botton &&
    plane.x - plane.hitboxWidth / 2 < rock.x + rock.width &&
    plane.x - plane.hitboxWidth / 2 > rock.x;
}