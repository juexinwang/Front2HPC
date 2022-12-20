<?php

$pdb_name = $_GET['pdb'];
echo $pdb_name;
$path = $_GET['path']


?>

<html>

<head>
  <title>Dengue Virus Methyl Transferase</title>
  <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
</head>

<body>
  <div id=viewer></div>
</body>
<script type='text/javascript' src='bio-pv.min.js'></script>

<script type='text/javascript'>
  // override the default options with something less restrictive.
  var options = {
    width: 645,
    height: 500,
    antialias: true,
    quality: 'medium'
  };
  // insert the viewer under the Dom element with id 'gl'.
  var viewer = pv.Viewer(document.getElementById('viewer'), options);


  function loadMethylTransferase() {

    var pdb_name = '<?php echo $pdb_name ;?>';
    var path = '<?php echo $path ;?>';
    var pdb_filename = '/pdbs/' + pdb_name;
    var arr = path.trim().split('-')

    // asynchronously load the PDB file for the dengue methyl transferase
    // from the server and display it in the viewer.
    pv.io.fetchPdb(pdb_filename, function (structure) {
      // display the protein as cartoon, coloring the secondary structure
      // elements in a rainbow gradient.
      viewer.cartoon('protein', structure, { color: color.ssSuccession() });
      // there are two ligands in the structure, the co-factor S-adenosyl
      // homocysteine and the inhibitor ribavirin-5' triphosphate. They have
      // the three-letter codes SAH and RVP, respectively. Let's display them
      // with balls and sticks.
      var ligands = structure.select({ rnames: ['SAH', 'RVP'] });
     
      
      for (i = 0; i < arr.length-1; i++) { 
        let res1_atom;
        let res2_atom;
        structure.select({cname: 'A', rnum:Number(arr[i]), aname: 'CA'})
        .eachAtom(function(a){ res1_atom = a; });
        structure.select({cname: 'A', rnum:Number(arr[i+1]), aname: 'CA'})
        .eachAtom(function(b){ res2_atom = b; });
        console.log('php')
        console.log(res1_atom)
        let cm = viewer.customMesh('joinTheDots');
        cm.addSphere(res2_atom.pos(), 2, { color : 'black' });
        cm.addSphere(res1_atom.pos(), 2, { color : 'black' });
        cm.addTube(res2_atom.pos(), res1_atom.pos(), .5, { cap : true, color : 'grey' });
      }
      viewer.ballsAndSticks('ligands', ligands);
      // viewer.fitParent();
      viewer.autoZoom();
      viewer.centerOn(structure);
    });
  }

  // load the methyl transferase once the DOM has finished loading. That's
  // the earliest point the WebGL context is available.
  document.addEventListener('DOMContentLoaded', loadMethylTransferase);
</script>


