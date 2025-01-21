<?php 
function create_shortcode_wp_critket() { ?>

<div id="root" style="max-width:100%"></div>

<link href="<?php echo critket_url;?>Views/react-app/build/static/css/main.css" rel="stylesheet">
<script src="<?php echo critket_url;?>Views/react-app/build/static/js/main.js"></script>

<?php }

add_shortcode( 'wp_critket', 'create_shortcode_wp_critket');