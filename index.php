<?php
    require 'vendor/autoload.php';

    use Slim\Slim;

    $config = require 'config/main.php';

    $app = new Slim();
    $app->data = (Object) [];

    // Hook to ensure places.json db is present and valid
    $app->hook('slim.before.dispatch', function () use ($app, $config) {
        // This should be class constant
        $errorWording = 'Error reading and decoding places.json database file.';

        if ($config && array_key_exists('places', $config) &&
            file_exists($config['places'])) {
            try {
                $app->data->placesJSON = file_get_contents($config['places']);
                $app->data->places = json_decode($app->data->placesJSON, true);

                if (!is_array($app->data->places)) {
                    $app->halt(403, $errorWording);
                }

                return true;
            } catch (\Exception $e) { 
                $app->halt(403, $errorWording);
            }
        }

        $app->halt(403, $errorWording);        
    });

    // Get all
    $app->get('/api/place', function () use ($app) {
        echo $app->data->placesJSON;
    });

    $app->get('/api/place/:date', function ($date) use ($app, $config) {
        if ($date && array_key_exists($date, $app->data->places)) {
            echo $app->data->places[$date];
        } else {
            $app->halt(403, 'Error getting date entry.');
        }
    });

    // Create new entry
    $app->post('/api/place', function () use ($app, $config) {
        $requestBody = json_decode($app->request->getBody());
        $place = $requestBody->place;
        $date = $requestBody->date;

        if ($date && $place && preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/", $date) &&
            !array_key_exists($date, $app->data->places)) {
            // Add new entry
            // Can assume $app->places is valid here as before dispatch hook would have been run.
            $places = $app->data->places;
            $places[$date]= $place;
            $app->data->places = $places;
            $app->data->placesJSON = json_encode($app->data->places);

            // Save file
            if (file_put_contents($config['places'], $app->data->placesJSON)) {
                $app->halt(200, 'Entry successfully saved.');
            }
        }

        $app->halt(403, 'Error saving entry.');
    });

    $app->get('/:method', function () use ($app) {
        $app->render('index.html');
    })->conditions(array('method' => '.*?'));

    $app->run();