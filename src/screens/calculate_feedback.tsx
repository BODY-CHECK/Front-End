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

export const detectOutlier = (currentAngle, previousAngle, threshold = 10) => {
    if (previousAngle !== null && Math.abs(currentAngle - previousAngle) > threshold) {
        //console.log('Outlier detected: Ignoring frame');
        return true;
    }
    return false;
};

export const updateStateAndFeedback = (
    elbowAngle, hipAngle, kneeAngle,
    currentState, setState, setRepCount, booleans, setBooleans
) => {
    // 시작 자세 기준
    if (currentState === null) {
        console.log('Null state detected')
    }
    if (
        currentState === null &&
        elbowAngle > 140 && elbowAngle < 190 &&
        hipAngle > 140 && hipAngle < 200 &&
        kneeAngle > 125 && kneeAngle < 190
    ) {
        setState('initial');
        console.log('Initial state detected');
        return;
    }

    // 상태 업데이트 및 각도 업데이트는 'exercising'일 때만
    if (currentState === 'exercising') {
        setBooleans((prevBooleans) => ({
            ...prevBooleans,
            elbow: elbowAngle <= 90 ? false : prevBooleans.elbow,
            hip: hipAngle < 160 || hipAngle > 190 ? true : prevBooleans.hip,
            knee: kneeAngle < 160 || kneeAngle > 190 ? true : prevBooleans.knee,
        
        }));
        //console.log(booleans)
    }
    // 상태 판별 로직
    if (currentState === 'exercising') {
        if (elbowAngle >= 150 && elbowAngle <= 200) {
            setState('finished');
            setRepCount((count) => count + 1);
            console.log('Finished state detected');
        } else if (currentState === null || currentState === 'finished') {
            setState('initial');
            console.log('Transitioned to initial state');
        }
    }

    if (elbowAngle <= 130 && currentState === 'initial') {
        setState('exercising');
        console.log('Exercising state detected');
    }
};
