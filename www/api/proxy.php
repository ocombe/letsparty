<?php
header('Content-Type: text/json; charset=utf-8');

$data = array(
	"client_id" => "AILRLkY9eWRcYRGGFZKHzU1uzByLnNoT",
	"client_secret" => "Z0W-gKxeQL3pUwE-xnTUpsFeRQyo5C3jz46mLk4rcbWh0jW_uXlnbIE5v6-ld3he",
	"grant_type" => "client_credentials"
);

$data_string = json_encode($data);

$ch = curl_init('https://letsparty.auth0.com/oauth/token');
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
		'Content-Type: application/json',
		'Content-Length: ' . strlen($data_string))
);

$result = curl_exec($ch);

var_dump($result);