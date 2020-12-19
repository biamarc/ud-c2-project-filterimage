import express from 'express';
import bodyParser from 'body-parser';
import {deleteLocalFiles, filterImageFromURL} from './util/util';

(async () => {

    // Init the Express application
    const app = express();

    // Set the network port
    const port = process.env.PORT || 8082;

    // Use the body parser middleware for post requests
    app.use(bodyParser.json());

    // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
    // GET /filteredimage?image_url={{URL}}
    // endpoint to filter an image from a public url.
    // IT SHOULD
    //    1
    //    1. validate the image_url query
    //    2. call filterImageFromURL(image_url) to filter the image
    //    3. send the resulting file in the response
    //    4. deletes any files on the server on finish of the response
    // QUERY PARAMATERS
    //    image_url: URL of a publicly accessible image
    // RETURNS
    //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

    /**************************************************************************** */

    /**
     * Filter an image input.
     *
     */
    app.get('/filteredimage', async (req, res) => {
        let {image_url} = req.query;
        //console.log(`image_url=${image_url}`);
        if (!image_url) {
            return res.status(400).send('image url not found; try GET /filteredimage?image_url=url_of_image');
        }
        try {
            const file: string = await filterImageFromURL(<string>image_url);
            if (file === null) {
                return res.status(500).send('unable to read the image')
            }
            res.status(200).sendFile(file, (err) => {
                if (err) {
                    console.log(`errors: ${err},  sending file: ${file}`);
                }
                deleteLocalFiles(new Array<string>(file))
                    .catch (e => console.log(`error deleting file: ${e}`));
            });
        } catch (e){
            console.log(`there was an error: ${e}`)
            res.status(500).send('unable to process the request image');
        }


    });

    //! END @TODO1

    // Root Endpoint
    // Displays a simple message to the user
    app.get('/', async (req, res) => {
        res.send('try GET /filteredimage?image_url={{}}');
    });


    // Start the Server
    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
})();
