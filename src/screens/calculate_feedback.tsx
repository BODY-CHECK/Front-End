// 3 점으로 이루어지는 각도 계산
export const calculateAngle = (point1, point2, point3) => {
    const vectorSubtract = (p1, p2) => ({
        x: p1.x - p2.x,
        y: p1.y - p2.y,
    });

    const dotProduct = (v1, v2) => v1.x * v2.x + v1.y * v2.y;
    const magnitude = (v) => Math.sqrt(v.x * v.x + v.y * v.y);

    const vectorA = vectorSubtract(point1, point2);
    const vectorB = vectorSubtract(point3, point2);

    const dotProd = dotProduct(vectorA, vectorB);
    const magnitudeA = magnitude(vectorA);
    const magnitudeB = magnitude(vectorB);

    const angleRadians = Math.acos(dotProd / (magnitudeA * magnitudeB));
    const angleDegrees = angleRadians * (180 / Math.PI);

    return angleDegrees;
};

// 특이값 계산
export const detectOutlier = (currentAngle, previousAngle, threshold = 10) => {
    if (previousAngle !== null && Math.abs(currentAngle - previousAngle) > threshold) {
        //console.log('Outlier detected: Ignoring frame');
        return true;
    }
    return false;
};

// 2 점으로 이루어지는 직선과 지면사이의 각도 계산
export const calculateSlopeAngle = (point1, point2) => {
    // 기울기 계산
    const deltaX = point2.x - point1.x;
    const deltaY = point2.y - point1.y;

    // 기울기로 각도 계산
    const angleRadians = Math.atan2(deltaY, deltaX); // atan2는 올바른 사분면에서 각도를 계산
    const angleDegrees = angleRadians * (180 / Math.PI);

    // 각도를 절대값으로 변환하여 0~90도 범위로 제한
    const slopeAngle = Math.abs(angleDegrees);

    return slopeAngle;
};

// 운동 종류에 따른 초기 자세 및 운동 상태 로직
// move는 초기 시작 기준만 잡는 거고, 나머지 stop1,2는 처음부터 끝까지 유지해야 되는 범위
const initialPostureCriteria = {
    0: { move1: [0, 30], move2: [0, 30], default: [0, 360], lie: [45, 135] },       // Tutorial 완료
    1: { move: [150, 190], stop1: [150, 185], stop2: [150, 185], lie: [135, 190] },  // push up 완료
    2: { move: [150, 190], stop1: [160, 180], stop2: [40, 140], lie: [135, 190] },   // knee push up 완료
    3: { move: [170, 190], stop1: [0, 200], stop2: [0, 200], lie: [45, 135] },      // pull up 완료
    4: { move: [180, 200], stop1: [170, 190], stop2: [160, 180], lie: [45, 135] },  // banding pull up 완료
    5: { move: [130, 160], stop1: [0, 80], stop2: [60, 110], lie: [135, 190] },      // sit up 완료
    6: { move: [170, 190], stop1: [130, 190], stop2: [80, 150], lie: [135, 190] },   // leg raise 완료
    7: { move: [170, 200], stop1: [170, 190], stop2: [160, 180], lie: [45, 135] },  // hanging leg raise 완료
    8: { move: [170, 200], stop1: [100, 150], stop2: [60, 130], lie: [45, 135] },   // squat 완료
    9: { move: [170, 200], stop1: [100, 150], stop2: [0, 999], lie: [45, 135] },        // one leg squat (구현 안됨)
    10: { move: [170, 200], stop1: [100, 150], stop2: [65, 125], lie: [45, 135] },       // lunge 확정 x 대강 가능
    11: { move: [80, 110], stop1: [160, 185], stop2: [70, 110], lie: [45, 135] },       // calf raise 확정 x
    12: { move: [110, 140], stop1: [30, 90], stop2: [0, 999], lie: [135, 190] },       // hip thrust (구현 안됨)
};

// Clear까지 줄어야 하고, En까지 다시 늘어야 함
// moveStart부터 운동 상태로 판별하는 코드로 변경할 것
const exerciseThresholds = {
    0: { moveClear: 90, moveStart: 70, moveEnd: 30},        // Tutorial
    1: { moveClear: 90, moveStart: 130, moveEnd: 160 },     // push up
    2: { moveClear: 90, moveStart: 130, moveEnd: 160 },     // knee push up 170
    3: { moveClear: 70, moveStart: 140, moveEnd: 170 },     // pull up
    4: { moveClear: 130, moveStart: 140, moveEnd: 160 },    // banding pull up
    5: { moveClear: 60, moveStart: 100, moveEnd: 130 },     // sit up
    6: { moveClear: 100, moveStart: 140, moveEnd: 170 },    // leg raise
    7: { moveClear: 100, moveStart: 140, moveEnd: 170 },    // hanging leg  raise
    8: { moveClear: 90, moveStart: 140, moveEnd: 170},      // squat
    9: { moveClear: 90, moveStart: 140, moveEnd: 170 },     // one leg squat
    10: { moveClear: 90, moveStart: 140, moveEnd: 170 },     // lunge
    11: { moveClear: 140, moveStart: 120, moveEnd: 100 },     // calf raise
    12: { moveClear: 170, moveStart: 150, moveEnd: 120 },     // hip thrust
};

export const updateStateAndFeedback = (
    moveAngle, stop1Angle, stop2Angle, lieAngle,
    currentState, setState, setRepCount, booleans, setBooleans, exerciseType, Point1, Point2
) => {
    const postureCriteria = initialPostureCriteria[exerciseType];
    const thresholds = exerciseThresholds[exerciseType];
    if (!postureCriteria || !thresholds) {
        console.error('운동 유형이 유효하지 않습니다:', exerciseType);
        return;
    }
    // 시작 자세 기준
    if (currentState === null) {
        console.log('Null state detected')
    }
    if (
        currentState === null &&
        moveAngle > postureCriteria.move[0] && moveAngle < postureCriteria.move[1] &&
        stop1Angle > postureCriteria.stop1[0] && stop1Angle < postureCriteria.stop1[1] &&
        stop2Angle > postureCriteria.stop2[0] && stop2Angle < postureCriteria.stop2[1] &&
        lieAngle > postureCriteria.lie[0] && lieAngle < postureCriteria.lie[1]
    ) {
        setState('initial');
        console.log('Initial state detected', exerciseType);
        return;
    }

    // 상태 업데이트 및 각도 업데이트는 'exercising'일 때만
    if (currentState === 'exercising') {
        // Point1.x === 무릎의 x좌표, Point2.x === 발끝의 x좌표
        if (Number(exerciseType) === 8){
            setBooleans((prevBooleans) => ({
                ...prevBooleans,
                move: moveAngle <= thresholds.moveClear ? false : prevBooleans.move,
                stop1: Point1.x > Point2.x + 30 ? true : prevBooleans.stop1,
                stop2: stop2Angle < postureCriteria.stop2[0] || stop2Angle > postureCriteria.stop2[1] ? true : prevBooleans.stop2,
            }));
        } else if (Number(exerciseType) === 10) {
            setBooleans((prevBooleans) => ({
                ...prevBooleans,
                move: moveAngle <= thresholds.moveClear ? false : prevBooleans.move,
                stop1: Point1.x > Point2.x + 10 ? true : prevBooleans.stop1,
                stop2: stop2Angle < postureCriteria.stop2[0] || stop2Angle > postureCriteria.stop2[1] ? true : prevBooleans.stop2,
            }));
        } else {
            setBooleans((prevBooleans) => ({
                ...prevBooleans,
                move: moveAngle <= thresholds.moveClear ? false : prevBooleans.move,
                stop1: stop1Angle < postureCriteria.stop1[0] || stop1Angle > postureCriteria.stop1[1] ? true : prevBooleans.stop1,
                stop2: stop2Angle < postureCriteria.stop2[0] || stop2Angle > postureCriteria.stop2[1] ? true : prevBooleans.stop2,
            }));
        }
    }
    // 상태 판별 로직
    if (currentState === 'exercising') {
        if (moveAngle >= thresholds.moveEnd && moveAngle <= postureCriteria.move[1]) {
            setState('finished');
            setRepCount((count) => count + 1);
            console.log('Finished state detected for', exerciseType);
        } else if (currentState === null || currentState === 'finished') {
            setState('initial');
            console.log('Transitioned to initial state for', exerciseType);
        }
    }

    if (moveAngle <= thresholds.moveStart && currentState === 'initial') {
        setState('exercising');
        console.log('Exercising state detected for', exerciseType);
    }
};

export const updateStateAndFeedbackwithTime = (
    moveAngle, stop1Angle, stop2Angle, lieAngle,
    currentState, setState, setRepCount, booleans, setBooleans, exerciseType
) => {
    const postureCriteria = initialPostureCriteria[exerciseType];
    const thresholds = exerciseThresholds[exerciseType];

    if (!postureCriteria || !thresholds) {
        console.error('운동 유형이 유효하지 않습니다:', exerciseType);
        return;
    }

    if (currentState === null) {
        console.log('Null state detected');
    }

    if (
        currentState === null &&
        moveAngle > postureCriteria.move[0] && moveAngle < postureCriteria.move[1] &&
        stop1Angle > postureCriteria.stop1[0] && stop1Angle < postureCriteria.stop1[1] &&
        stop2Angle > postureCriteria.stop2[0] && stop2Angle < postureCriteria.stop2[1] &&
        lieAngle > postureCriteria.lie[0] && lieAngle < postureCriteria.lie[1]
    ) {
        setState('initial');
        return;
    }

    if (currentState === 'exercising') {
        console.log("moveAngle in Exercising:", moveAngle)
        console.log("stop1Angle in Exercising:", stop1Angle)
        if (Number(exerciseType) === 12){
            setBooleans((prevBooleans) => ({
                ...prevBooleans,
                move: moveAngle >= thresholds.moveClear ? false : prevBooleans.move,
                stop1: stop1Angle < postureCriteria.stop1[0] || stop1Angle > postureCriteria.stop1[1] ? true : prevBooleans.stop1,
            }));
        }
        else {
            setBooleans((prevBooleans) => ({
                ...prevBooleans,
                move: moveAngle <= thresholds.moveClear ? false : prevBooleans.move,
                stop1: stop1Angle < postureCriteria.stop1[0] || stop1Angle > postureCriteria.stop1[1] ? true : prevBooleans.stop1,
            }));
        }
    }
    if (currentState === 'initial') {
        console.log("moveAngle in Initial:", moveAngle)
    }
    if (currentState === 'exercising') {
        if (Number(exerciseType) === 12 && moveAngle >= postureCriteria.move[0] && moveAngle <= thresholds.moveEnd) {
            const elapsedTime = (Date.now() - exercisingStartTime) / 1000;
            if (elapsedTime < 1) {
                setBooleans((prevBooleans) => ({
                    ...prevBooleans,
                    stop2: true,
                }));
                console.log('exercise time is', elapsedTime);
                console.log('Speed feedback triggered: Exercise too fast');
            }
            setState('finished');
            setRepCount((count) => count + 1);
            exercisingStartTime = null;
            console.log('Finished state detected for', exerciseType);
        }
        else if (moveAngle >= thresholds.moveEnd && moveAngle <= postureCriteria.move[1]) {
            const elapsedTime = (Date.now() - exercisingStartTime) / 1000;
            // 만일 운동별로 너무 빠르다를 측정하는 시간을 바꾸고 싶다면 여기서 아래와 같은 코드들을 넣을 것
            // if (Number(exerciseType) === i) { timeLimit = j }
            // 그 후에 아래의 if (elapsedTime < 1) { 에서 1을 timeLimit로 수정할 것
            if (elapsedTime < 1) {
                setBooleans((prevBooleans) => ({
                    ...prevBooleans,
                    stop2: true,
                }));
                console.log('exercise time is', elapsedTime);
                console.log('Speed feedback triggered: Exercise too fast');
            }
            setState('finished');
            setRepCount((count) => count + 1);
            exercisingStartTime = null;
            console.log('Finished state detected for', exerciseType);
        }
    } else if (currentState === 'initial') {
        if (Number(exerciseType) === 12 && moveAngle >= thresholds.moveStart) {
            setState('exercising');
            exercisingStartTime = Date.now();
            console.log('Exercising state detected for', exerciseType);
        }else if (moveAngle <= thresholds.moveStart) {
            setState('exercising');
            exercisingStartTime = Date.now();
            console.log('Exercising state detected for', exerciseType);
        }
    } else if (currentState === null || currentState === 'finished') {
        setState('initial');
        console.log('Transitioned to initial state for', exerciseType);
    }
};

export const updateStateofTutorial = (
    move1Angle, move2Angle, lieAngle,
    currentState, setState, setRepCount, booleans, setBooleans, exerciseType
) => {
    const postureCriteria = initialPostureCriteria[exerciseType];
    const thresholds = exerciseThresholds[exerciseType];
    if (!postureCriteria || !thresholds) {
        console.error('운동 유형이 유효하지 않습니다:', exerciseType);
        return;
    }
    // 시작 자세 기준
    if (currentState === null) {
        console.log('Null state detected')
    }
    if (
        currentState === null &&
        move1Angle > postureCriteria.move1[0] && move1Angle < postureCriteria.move1[1] &&
        move2Angle > postureCriteria.move2[0] && move2Angle < postureCriteria.move2[1] &&
        lieAngle > postureCriteria.lie[0] && lieAngle < postureCriteria.lie[1]
    ) {
        setState('initial');
        console.log('Initial state detected', exerciseType);
        return;
    }

    // 상태 업데이트 및 각도 업데이트는 'exercising'일 때만
    if (currentState === 'exercising') {
        setBooleans((prevBooleans) => ({
            ...prevBooleans,
            move: move1Angle >= thresholds.moveClear && move2Angle >= thresholds.moveClear ? false : prevBooleans.move,
            stop1: false,
            stop2: false,
        }));
    }
    // 상태 판별 로직
    if (currentState === 'exercising') {
        if (move1Angle >= thresholds.moveEnd && move1Angle <= postureCriteria.move1[1] && move2Angle >= thresholds.moveEnd && move2Angle <= postureCriteria.move1[1]) {
            setState('finished');
            setRepCount((count) => count + 1);
            console.log('Finished state detected for', exerciseType);
        } else if (currentState === null || currentState === 'finished') {
            setState('initial');
            console.log('Transitioned to initial state for', exerciseType);
        }
    }

    if (move1Angle >= postureCriteria.move1[1] && currentState === 'initial') {
        setState('exercising');
        console.log('Exercising state detected for', exerciseType);
    }
};