const OBJECTS = {
    SUN: 'sun',
    MERCURY: 'mercury',
    VENUS: 'venus',
    EARTH: 'earth',
    MOON: 'moon',
    MARS: 'mars',
    JUPITER: 'jupiter',
    SATURN: 'saturn',
    SATURN_RINGS: 'saturn_rings',
    URANUS: 'uranus',
    NEPTUNE: 'neptune'
};

class ObjectGroup {
    constructor(index, title, radius, extra) {
        const objectGroup = new THREE.Group();

        if (extra) {
            switch (title) {
                case OBJECTS.EARTH:
                    extra.position.x += 8 * index + 2.5;

                    break;
                case OBJECTS.SATURN:
                    extra.position.x += 8 * index;
                    extra.rotation.x = 2;

                    break;
            }

            objectGroup.add(extra);
        }

        const planet = ObjectGroup.createObject(title, new THREE.SphereGeometry(radius, 64, 32));

        planet.position.x += 8 * index;
        objectGroup.add(planet);

        return objectGroup;
    }

    static createObject = (title, objectGeometry) => {
        const objectTexture = new THREE.TextureLoader().load(`textures/${title}.jpg`);
        const objectMaterial = new THREE.MeshPhongMaterial({ map: objectTexture });
        const objectMesh = new THREE.Mesh(objectGeometry, objectMaterial);

        return objectMesh;
    };
}

const planets = [
    { title: OBJECTS.MERCURY, radius: 1 },
    { title: OBJECTS.VENUS, radius: 2 },
    {
        title: OBJECTS.EARTH,
        radius: 2,
        extra: ObjectGroup.createObject(OBJECTS.MOON, new THREE.SphereGeometry(0.5, 64, 32))
    },
    { title: OBJECTS.MARS, radius: 1 },
    { title: OBJECTS.JUPITER, radius: 5 },
    {
        title: OBJECTS.SATURN,
        radius: 4,
        extra: ObjectGroup.createObject(OBJECTS.SATURN_RINGS, new THREE.TorusGeometry(6, 1, 2, 32))
    },
    { title: OBJECTS.URANUS, radius: 3 },
    { title: OBJECTS.NEPTUNE, radius: 3 }
];

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.z = 180;

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('root').appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xaaaaaa, 1);
const pointLight = new THREE.PointLight(0xffffff, 1);

pointLight.position.set(0, 0, 0);

scene.add(ambientLight, pointLight);

const starsCoords = [];

for (let i = 0; i < 10000; i++) {
    const x = THREE.MathUtils.randFloatSpread(1000);
    const y = THREE.MathUtils.randFloatSpread(1000);
    const z = THREE.MathUtils.randFloatSpread(1000);

    starsCoords.push(x, y, z);
}

const starsGeometry = new THREE.BufferGeometry();

starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsCoords, 3));

const starsMaterial = new THREE.PointsMaterial({ color: 0xaaaaaa });
const stars = new THREE.Points(starsGeometry, starsMaterial);

scene.add(stars);

const sun = ObjectGroup.createObject(OBJECTS.SUN, new THREE.SphereGeometry(11, 64, 32));

scene.add(sun);

const planetsMap = new Map();

for (let [index, { title, radius, extra }] of planets.entries()) {
    const planetGroup = new ObjectGroup(index + 1, title, radius, extra);

    planetsMap.set(title, planetGroup);
    sun.add(planetGroup);
}

const EARTH_YEAR = (2 * Math.PI) / 365;

const animate = () => {
    sun.rotation.y += 0.001;

    planetsMap.get(OBJECTS.MERCURY).rotation.y += EARTH_YEAR * 4;
    planetsMap.get(OBJECTS.VENUS).rotation.y += EARTH_YEAR * 2;
    planetsMap.get(OBJECTS.EARTH).rotation.y += EARTH_YEAR;
    planetsMap.get(OBJECTS.MARS).rotation.y += EARTH_YEAR / 2;
    planetsMap.get(OBJECTS.JUPITER).rotation.y += EARTH_YEAR / 4;
    planetsMap.get(OBJECTS.SATURN).rotation.y += EARTH_YEAR / 8;
    planetsMap.get(OBJECTS.URANUS).rotation.y += EARTH_YEAR / 16;
    planetsMap.get(OBJECTS.NEPTUNE).rotation.y += EARTH_YEAR / 32;

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
};

animate();
