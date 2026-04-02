/**
 * Highly Detailed Origin Jumpworks 100i - 3D Wireframe Model Generator
 * Procedurally constructed using advanced composite geometries for a sleek aerodynamic profile.
 */

window.createOrigin100i = function(THREE) {
    const activeShipGroup = new THREE.Group();
    
    // Dynamic display angle (Cinematic 3/4 view)
    activeShipGroup.rotation.set(0.2, -0.6, 0.1); 

    // --- Advanced Materials ---
    // Solid core to mask background and back-faces. 
    // PolygonOffset pushes the solid mesh back slightly in the render depth buffer to prevent Z-fighting with the lines.
    const solidMat = new THREE.MeshBasicMaterial({
        color: 0x0f172a, 
        transparent: true,
        opacity: 0.92,
        depthWrite: true,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1
    });

    // Glowing structural wireframe edges
    const lineMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 1.0,
        linewidth: 1
    });

    // Classic hologram surface grid (used sparingly on organic curves)
    const gridMat = new THREE.MeshBasicMaterial({
        color: 0x0ea5e9,
        wireframe: true,
        transparent: true,
        opacity: 0.08
    });

    // Engine Core glow
    const coreMat = new THREE.MeshBasicMaterial({ 
        color: 0xbae6fd, 
        transparent: true, 
        opacity: 0.9 
    });

    // Helper function: Bundles the solid mesh and glowing edges into a single part
    function createHoloPart(geometry, showGrid = false, edgeThreshold = 18) {
        const group = new THREE.Group();
        const mesh = new THREE.Mesh(geometry, solidMat);
        
        // EdgesGeometry isolates the sharp architectural lines instead of rendering messy triangulation diagonals
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

    // --- SHIP ASSEMBLY (Length ~19m, Beam ~11m) ---
    // Note: The ship is oriented to point forward along the positive Z-axis.

    // 1. Central Fuselage Core (Tapered aerodynamic cylinder)
    const midGeo = new THREE.CylinderGeometry(2.2, 1.6, 8, 64);
    midGeo.rotateX(-Math.PI / 2); // align along Z, wider at the front
    midGeo.scale(1, 0.35, 1); // Flatten to a sleek profile
    midGeo.translate(0, 0.5, -1);
    const midHull = createHoloPart(midGeo, true, 20);
    activeShipGroup.add(midHull);

    // 2. Nose (The iconic Origin 'Duck Bill')
    const noseGeo = new THREE.ConeGeometry(2.2, 6, 64);
    noseGeo.rotateX(-Math.PI / 2); // point tip forward
    noseGeo.scale(1, 0.35, 1); // match mid-hull flattening
    noseGeo.translate(0, 0.5, 6); // align base with mid-hull front
    const nose = createHoloPart(noseGeo, true, 20);
    activeShipGroup.add(nose);

    // 3. Rear Fuselage & Twin Engine Housing (Replaces simple cone)
    const rearShape = new THREE.Shape();
    rearShape.moveTo(1.5, 0);     // Front connection width
    rearShape.lineTo(2.2, -2.0);  // Widen for engine nacelles
    rearShape.lineTo(2.0, -4.0);  // Taper back
    rearShape.lineTo(0.5, -5.5);  // Central tail end
    rearShape.lineTo(-0.5, -5.5);
    rearShape.lineTo(-2.0, -4.0);
    rearShape.lineTo(-2.2, -2.0);
    rearShape.lineTo(-1.5, 0);

    const rearExtrude = { depth: 1.0, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.2, bevelThickness: 0.2 };
    const rearGeo = new THREE.ExtrudeGeometry(rearShape, rearExtrude);
    rearGeo.rotateX(Math.PI / 2); // Lay flat
    rearGeo.translate(0, 0.3, -4.8); // Position behind mid-hull
    const rearHull = createHoloPart(rearGeo, true, 25);
    activeShipGroup.add(rearHull);

    // 4. Canopy (Dark teardrop glass)
    const canopyGeo = new THREE.SphereGeometry(1.3, 48, 24);
    canopyGeo.scale(1, 0.6, 2.8);
    canopyGeo.translate(0, 1.2, 1.0);
    const canopy = createHoloPart(canopyGeo, true, 40);
    activeShipGroup.add(canopy);

    // 5. Lower Belly (Subtle downward curve for the cargo bay/landing gear)
    const bellyScoopGeo = new THREE.CylinderGeometry(1.2, 1.2, 6, 32);
    bellyScoopGeo.rotateX(Math.PI / 2);
    bellyScoopGeo.scale(1, 0.3, 1);
    bellyScoopGeo.translate(0, -0.2, -1);
    const bellyScoop = createHoloPart(bellyScoopGeo, false, 20);
    activeShipGroup.add(bellyScoop);

    // 6. Swept Delta Wings
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 4); // Root front
    wingShape.lineTo(5.5, -2); // Tip front
    wingShape.lineTo(5.5, -4.5); // Tip trailing edge
    wingShape.lineTo(0, -6); // Root trailing edge
    
    const leftWingShape = new THREE.Shape();
    leftWingShape.moveTo(0, 4);
    leftWingShape.lineTo(-5.5, -2);
    leftWingShape.lineTo(-5.5, -4.5);
    leftWingShape.lineTo(0, -6);

    const extrudeSettings = { depth: 0.15, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };
    
    const rightWingGeo = new THREE.ExtrudeGeometry(wingShape, extrudeSettings);
    rightWingGeo.rotateX(Math.PI / 2); // lay flat
    rightWingGeo.translate(0, 0.4, 0);
    const rightWing = createHoloPart(rightWingGeo, false, 15);
    activeShipGroup.add(rightWing);

    const leftWingGeo = new THREE.ExtrudeGeometry(leftWingShape, extrudeSettings);
    leftWingGeo.rotateX(Math.PI / 2); // lay flat
    leftWingGeo.translate(0, 0.4, 0);
    const leftWing = createHoloPart(leftWingGeo, false, 15);
    activeShipGroup.add(leftWing);

    // 7. Signature Rear Spoiler (The Arch)
    const archGeo = new THREE.TorusGeometry(3.0, 0.18, 16, 64, Math.PI);
    archGeo.rotateX(-Math.PI / 2.8); // Sweeps the arch gracefully towards the tail
    archGeo.translate(0, 0.5, -6.5); // Moved further back and slightly up
    const arch = createHoloPart(archGeo, false, 30);
    activeShipGroup.add(arch);

    // 8. Front Air Intakes (Carved cheeks)
    const intakeGeo = new THREE.CylinderGeometry(0.3, 0.5, 2.5, 4); 
    intakeGeo.rotateX(-Math.PI / 2); // Point wide end forward
    intakeGeo.rotateZ(Math.PI / 4); // Turn square into a diamond profile
    
    const rightIntake = createHoloPart(intakeGeo, false, 10);
    rightIntake.position.set(1.4, 0.5, 4.0);
    rightIntake.rotation.y = -Math.PI / 16; // Hug inward to the tapering hull
    activeShipGroup.add(rightIntake);

    const leftIntake = createHoloPart(intakeGeo, false, 10);
    leftIntake.position.set(-1.4, 0.5, 4.0);
    leftIntake.rotation.y = Math.PI / 16;
    activeShipGroup.add(leftIntake);

    // 9. Twin Engine Exhausts
    const exhaustGeo = new THREE.CylinderGeometry(0.7, 0.6, 1.8, 32);
    exhaustGeo.rotateX(Math.PI / 2);

    const leftExhaust = createHoloPart(exhaustGeo, true, 20);
    leftExhaust.position.set(-1.4, 0.3, -8.0);
    activeShipGroup.add(leftExhaust);

    const rightExhaust = createHoloPart(exhaustGeo, true, 20);
    rightExhaust.position.set(1.4, 0.3, -8.0);
    activeShipGroup.add(rightExhaust);

    // 10. Twin Engine Glows
    const coreGeo = new THREE.SphereGeometry(0.55, 16, 16);

    const leftCore = new THREE.Mesh(coreGeo, coreMat);
    leftCore.position.set(-1.4, 0.3, -8.6);
    leftCore.scale.set(1, 0.7, 1);
    activeShipGroup.add(leftCore);

    const rightCore = new THREE.Mesh(coreGeo, coreMat);
    rightCore.position.set(1.4, 0.3, -8.6);
    rightCore.scale.set(1, 0.7, 1);
    activeShipGroup.add(rightCore);

    // 11. Winglets (Vertical Stabilizers at the wing tips)
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0); // Bottom root
    finShape.lineTo(0.8, 1.8); // Top leading edge (swept back)
    finShape.lineTo(1.6, 1.8); // Top trailing edge
    finShape.lineTo(1.0, 0); // Bottom trailing edge
    
    const finExtrude = { depth: 0.08, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02 };
    
    const rightFinGeo = new THREE.ExtrudeGeometry(finShape, finExtrude);
    rightFinGeo.rotateY(Math.PI / 2); // Rotate to lie along the Z axis (sweep back)
    rightFinGeo.translate(-0.04, 0, 0.8); // Center locally
    const rightFin = createHoloPart(rightFinGeo, false, 15);
    rightFin.position.set(5.4, 0.4, -3.5);
    rightFin.rotation.z = -Math.PI / 10; // Splay outwards
    activeShipGroup.add(rightFin);

    const leftFinGeo = new THREE.ExtrudeGeometry(finShape, finExtrude);
    leftFinGeo.rotateY(Math.PI / 2); 
    leftFinGeo.translate(-0.04, 0, 0.8); 
    const leftFin = createHoloPart(leftFinGeo, false, 15);
    leftFin.position.set(-5.4, 0.4, -3.5);
    leftFin.rotation.z = Math.PI / 10; // Splay outwards
    activeShipGroup.add(leftFin);

    // 12. Structural Paneling Details (Forces EdgeGeometry to draw tech lines across the hull)
    const spineGeo = new THREE.BoxGeometry(1.2, 0.1, 4);
    const spine = createHoloPart(spineGeo, false, 15);
    spine.position.set(0, 0.8, -4);
    activeShipGroup.add(spine);

    return activeShipGroup;
};
