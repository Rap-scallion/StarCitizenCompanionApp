/**
 * Detailed Origin Jumpworks 100i - 3D Wireframe Model Generator
 * This script attaches `createOrigin100i` to the global window object.
 * When called, it returns a fully constructed THREE.Group containing the detailed ship.
 */

window.createOrigin100i = function(THREE) {
    const activeShipGroup = new THREE.Group();
    
    // Set an initial cool dynamic angle
    activeShipGroup.rotation.set(0.2, -0.6, 0.1); 

    // --- Materials ---
    // Solid core to mask background and back-faces
    const solidMat = new THREE.MeshBasicMaterial({
        color: 0x0f172a, 
        transparent: true,
        opacity: 0.95,
        depthWrite: true
    });

    // Glowing wireframe edges
    const lineMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 1.0
    });

    // Classic hologram grid (used sparingly on organic shapes like the canopy)
    const gridMat = new THREE.MeshBasicMaterial({
        color: 0x0ea5e9,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });

    // Helper function to create a solid object with glowing structural edges
    function createHoloPart(geometry, showGrid = false, edgeThreshold = 15) {
        const group = new THREE.Group();
        const mesh = new THREE.Mesh(geometry, solidMat);
        
        // EdgesGeometry hides the ugly triangulation diagonals, showing sharp structural lines
        const edges = new THREE.EdgesGeometry(geometry, edgeThreshold);
        const lines = new THREE.LineSegments(edges, lineMat);
        
        group.add(mesh);
        group.add(lines);
        
        if (showGrid) {
            const grid = new THREE.Mesh(geometry, gridMat);
            group.add(grid);
        }
        return group;
    }

    // --- SHIP ASSEMBLY ---

    // 1. Main Hull Core (Extruded Profile)
    const hullShape = new THREE.Shape();
    hullShape.moveTo(0, 9.5); // Nose tip
    hullShape.lineTo(1.2, 8.5); // Snout curve
    hullShape.lineTo(1.8, 4.0); // Cockpit side
    hullShape.lineTo(5.5, -2.5); // Swept wing leading edge
    hullShape.lineTo(5.5, -3.5); // Wing tip width
    hullShape.lineTo(2.5, -5.0); // Wing trailing edge
    hullShape.lineTo(2.0, -8.5); // Rear engine housing
    hullShape.lineTo(-2.0, -8.5); // Rear exhaust block
    hullShape.lineTo(-2.5, -5.0); // Left wing trailing
    hullShape.lineTo(-5.5, -3.5); // Left wing tip
    hullShape.lineTo(-5.5, -2.5); // Left wing leading
    hullShape.lineTo(-1.8, 4.0); // Left cockpit side
    hullShape.lineTo(-1.2, 8.5); // Left snout
    hullShape.lineTo(0, 9.5); // Back to Nose

    const hullExtrudeSettings = { depth: 0.8, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.3, bevelThickness: 0.4 };
    const hullGeo = new THREE.ExtrudeGeometry(hullShape, hullExtrudeSettings);
    hullGeo.rotateX(Math.PI / 2);
    hullGeo.translate(0, 0.4, 0);
    const hull = createHoloPart(hullGeo, true, 20); 
    activeShipGroup.add(hull);

    // 2. Canopy (Sleek teardrop dome)
    const canopyGeo = new THREE.SphereGeometry(1, 32, 16);
    canopyGeo.scale(1.2, 0.8, 3.5);
    canopyGeo.translate(0, 1.2, 1.5);
    const canopy = createHoloPart(canopyGeo, true, 45);
    activeShipGroup.add(canopy);

    // 3. Canopy Frame / Rim (Adds detail lines around the glass)
    const canopyRimGeo = new THREE.TorusGeometry(1.2, 0.08, 8, 32);
    canopyRimGeo.scale(1, 1, 2.9);
    canopyRimGeo.rotateX(Math.PI / 2);
    canopyRimGeo.translate(0, 1.2, 1.5);
    const canopyRim = createHoloPart(canopyRimGeo, false);
    activeShipGroup.add(canopyRim);

    // 4. Underbelly (Adds aerodynamic bulk to the flat extrusion)
    const bellyGeo = new THREE.SphereGeometry(1, 32, 16);
    bellyGeo.scale(1.6, 0.6, 5.0);
    bellyGeo.translate(0, -0.2, -1.0);
    const belly = createHoloPart(bellyGeo, true, 45);
    activeShipGroup.add(belly);

    // 5. Signature Rear Spoiler (Hoop/Arch) - Upgraded with varying thickness
    const archGeo = new THREE.TorusGeometry(2.4, 0.25, 16, 48, Math.PI);
    archGeo.rotateX(-Math.PI / 4.5);
    archGeo.translate(0, 0.8, -7.5);
    const arch = createHoloPart(archGeo, false, 30);
    activeShipGroup.add(arch);

    // 6. Spoiler Struts (Connecting arch to hull)
    const strutGeo = new THREE.BoxGeometry(0.2, 1.5, 0.6);
    const leftStrut = createHoloPart(strutGeo, false);
    leftStrut.position.set(-1.8, 0.8, -6.5);
    leftStrut.rotation.x = -Math.PI / 6;
    leftStrut.rotation.z = Math.PI / 12;
    activeShipGroup.add(leftStrut);
    
    const rightStrut = createHoloPart(strutGeo, false);
    rightStrut.position.set(1.8, 0.8, -6.5);
    rightStrut.rotation.x = -Math.PI / 6;
    rightStrut.rotation.z = -Math.PI / 12;
    activeShipGroup.add(rightStrut);

    // 7. Winglets (Vertical Stabilizers at wingtips)
    const finGeo = new THREE.BoxGeometry(0.15, 1.8, 1.5);
    finGeo.translate(0, 0.9, 0); 
    finGeo.rotateX(-Math.PI / 6); 

    const leftFin = createHoloPart(finGeo, false);
    leftFin.position.set(-5.3, 0.2, -3.2);
    leftFin.rotation.z = -Math.PI / 8;
    activeShipGroup.add(leftFin);

    const rightFin = createHoloPart(finGeo, false);
    rightFin.position.set(5.3, 0.2, -3.2);
    rightFin.rotation.z = Math.PI / 8;
    activeShipGroup.add(rightFin);

    // 8. Front Intakes (Detailed geometric recesses in the nose)
    const intakeGeo = new THREE.BoxGeometry(1.6, 0.5, 1.2);
    
    const rightIntake = createHoloPart(intakeGeo, false);
    rightIntake.position.set(1.4, 0.1, 7.8);
    rightIntake.rotation.y = Math.PI / 12;
    activeShipGroup.add(rightIntake);

    const leftIntake = createHoloPart(intakeGeo, false);
    leftIntake.position.set(-1.4, 0.1, 7.8);
    leftIntake.rotation.y = -Math.PI / 12;
    activeShipGroup.add(leftIntake);

    // 9. Main Engine Exhaust Block
    const exhaustGeo = new THREE.BoxGeometry(3.8, 0.8, 0.8);
    const exhaust = createHoloPart(exhaustGeo, false);
    exhaust.position.set(0, 0.4, -8.6);
    activeShipGroup.add(exhaust);

    // 10. Engine Thruster Cones
    const thrusterGeo = new THREE.CylinderGeometry(0.4, 0.6, 0.8, 16);
    thrusterGeo.rotateX(Math.PI / 2);
    
    const mainThruster = createHoloPart(thrusterGeo, true);
    mainThruster.position.set(0, 0.4, -9.0);
    activeShipGroup.add(mainThruster);

    // 11. Wing Paneling Details (Forces EdgesGeometry to draw cool tech lines)
    const panelGeo = new THREE.BoxGeometry(3.0, 0.1, 1.5);
    
    const leftPanel = createHoloPart(panelGeo, false);
    leftPanel.position.set(-2.5, 0.82, -2.0);
    leftPanel.rotation.y = -Math.PI / 16;
    activeShipGroup.add(leftPanel);

    const rightPanel = createHoloPart(panelGeo, false);
    rightPanel.position.set(2.5, 0.82, -2.0);
    rightPanel.rotation.y = Math.PI / 16;
    activeShipGroup.add(rightPanel);

    // 12. Nose Paneling / Access Hatch
    const nosePanelGeo = new THREE.BoxGeometry(1.2, 0.1, 2.5);
    const nosePanel = createHoloPart(nosePanelGeo, false);
    nosePanel.position.set(0, 0.82, 6.5);
    activeShipGroup.add(nosePanel);

    return activeShipGroup;
};