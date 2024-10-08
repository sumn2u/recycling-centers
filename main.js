const fetchRecyclingLocations = async (zipCode) => {
    const url = `https://legacyapi.recyclenation.com/locations?auth_code=8f194edfb445b5164dff2741098d1a1e&zip=${zipCode}&radius=100&offset=0&limit=100&material_id=`;

    try {
        const response = await fetch(url, {
            headers: {
                "accept": "*/*",
                "accept-language": "en,en-US;q=0.9,de;q=0.8",
                "cache-control": "no-cache",
                "pragma": "no-cache",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Google Chrome\";v=\"127\", \"Chromium\";v=\"127\"",
                "sec-ch-ua-mobile": "?1",
                "sec-ch-ua-platform": "\"Android\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site"
            },
            referrer: "https://recyclenation.com/",
            referrerPolicy: "strict-origin-when-cross-origin",
            method: "GET",
            mode: "cors",
            credentials: "omit"
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // Prepare CSV headers
        let csv = 'name,description,address,city,region,province,postal_code,phone,fax,hours,url,latitude,longitude,distance,materials,pickup,dropoff,notes,groups,curbside,municipal,national,event_only\n';

        // Convert JSON to CSV
        data.locations.forEach(location => {

            delete location.location_id;
            delete location.location_uri; 

            // Flatten the materials array to a single string with descriptions
            const materials = location.materials.map(material => material.description).join('; ');

            // Create a CSV row
            const row = [
                location.name,
                location.description,
                location.address,
                location.city,
                location.region,
                location.province,
                location.postal_code,
                location.phone,
                location.fax,
                location.hours.replace(/\r?\n|\r/g, ' '), // Remove new lines from hours
                location.url,
                location.latitude,
                location.longitude,
                location.distance,
                materials,
                location.pickup,
                location.dropoff,
                location.notes,
                location.groups,
                location.curbside,
                location.municipal,
                location.national,
                location.event_only
            ];

            // Join the row with commas and add it to the CSV
            csv += row.map(field => `"${field}"`).join(',') + '\n';
        });

        // Create a downloadable link
        const csvBlob = new Blob([csv], { type: 'text/csv' });
        const link = URL.createObjectURL(csvBlob);
        const a = document.createElement('a');
        a.href = link;
        a.download = `${zipCode}.csv`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();

        // Clean up
        document.body.removeChild(a);
        URL.revokeObjectURL(link);
       
        console.log(`Response for ZIP code ${zipCode} downloaded`);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

// 35004
// Replace with the ZIP codes you want to fetch data for
const zipCodes = [
    "01001", "01002", "01003", "01004", "01005", "01007", "01008", "01009", "01010", 
    "01011", "01012", "01013", "01014", "01020", "01021", "01022", "01026", "01027", 
    "01028", "01030", "01031", "01032", "01033", "01034", "01035", "01036", "01037", 
    "01038", "01039", "01040", "01041", "01050", "01053", "01054", "01056", "01057", 
    "01059", "01060", "01061", "01062", "01063", "01066", "01068", "01069", "01070", 
    "01071", "01072", "01073", "01074", "01075", "01077", "01079", "01080", "01081", 
    "01082", "01083", "01084", "01085", "01086", "01087", "01088", "01089", "01090", 
    "01092", "01093", "01094", "01095", "01101", "01103", "01104", "01105", "01107", 
    "01108", "01109", "01111", "01115", "01116", "01118", "01119", "01128", "01129", 
    "01151", "01152", "01199", "01201", "01202", "01203", "01204", "01205", "01220", 
    "01222", "01223", "01224", "01225", "01226", "01227", "01230", "01235", "01236", 
    "01237", "01238", "01240", "01242", "01243", "01244", "01245", "01247", "01250", 
    "01252", "01253", "01254", "01255", "01256", "01257", "01258", "01259", "01260", 
    "01262", "01263", "01264", "01266", "01267", "01270", "01271", "01273", "01274", 
    "01275", "01276", "01280", "01281", "01301", "01302", "01303", "01330", "01331", 
    "01332", "01333", "01334", "01337", "01338", "01339", "01340", "01341", "01342", 
    "01344", "01346", "01347", "01349", "01350", "01351", "01354", "01360", "01364", 
    "01366", "01367", "01368", "01370", "01373", "01375", "01376", "01378", "01379", 
    "01380", "01384", "01420", "01430", "01431", "01432", "01434", "01436", "01438", 
    "01440", "01450", "01451", "01452", "01453", "01460", "01462", "01463", "01464", 
    "01467", "01468", "01469", "01470", "01471", "01472", "01473", "01474", "01475", 
    "01477", "01478", "01501", "01503", "01504", "01505", "01506", "01507", "01508", 
    "01509", "01510", "01515", "01516", "01518", "01519", "01520", "01521", "01522", 
    "01523", "01524", "01525", "01526", "01527", "01529", "01531", "01532", "01534", 
    "01535", "01536", "01537", "01540", "01541", "01542", "01543", "01545", "01546", 
    "01550", "01552", "01560", "01561", "01562", "01564", "01566", "01568", "01569", 
    "01570", "01571", "01580", "01581", "01583", "01585", "01586", "01588", "01601", 
    "01602", "01603", "01604", "01605", "01606", "01607", "01608", "01609", "01610", 
    "01611", "01612", "01613", "01614", "01615", "01630", "01631", "01632", "01634", 
    "01635", "01636", "01637", "01638", "01639", "01640", "01641", "01652", "01653", 
    "01654", "01655", "01656", "01701", "01702", "01703", "01704", "01705", "01706", 
    "01720", "01721", "01730", "01731", "01732", "01733", "01734", "01735", "01736", 
    "01737", "01740", "01741", "01742", "01745", "01746", "01747", "01748", "01749", 
    "01750", "01752", "01754", "01756", "01757", "01760", "01770", "01772", "01773", 
    "01775", "01776", "01778", "01801", "01803", "01804", "01805", "01806", "01807", 
    "01808", "01810", "01812", "01813", "01815", "01821", "01822", "01824", "01826", 
    "01827", "01830", "01831", "01832", "01833", "01834", "01835", "01840", "01841", 
    "01843", "01844", "01845", "01850", "01851", "01852", "01853", "01854", "01860", 
    "01862", "01863", "01864", "01865", "01867", "01876", "01880", "01885", "01886", 
    "01887", "01888", "01901", "01902", "01903", "01904", "01905", "01906", "01907", 
    "01908", "01910", "01913", "01915", "01921", "01922", "01923", "01929", "01930", 
    "01931", "01932", "01940", "01944", "01945", "01949", "01950", "01952", "01960", 
    "01961", "01966", "01969", "01970", "01971", "01982", "01983", "01985", "01988", 
    "02018", "02019", "02020", "02021", "02025", "02026", "02027", "02030", "02032", 
    "02035", "02038", "02040", "02043", "02044", "02045", "02047", "02048", "02050", 
    "02051", "02052", "02053", "02054", "02056", "02059", "02060", "02061", "02062", 
    "02065", "02066", "02067", "02071", "02072", "02090", "02093", "02094", "02081", 
    "02101", "02102", "02103", "02108", "02109", "02110", "02111", "02112", "02113", 
    "02114", "02115", "02116", "02118", "02119", "02120", "02121", "02122", "02124", 
    "02125", "02126", "02127", "02128", "02129", "02130", "02131", "02132", "02134", 
    "02135", "02136", "02138", "02139", "02140", "02141", "02143", "02144", "02145", 
    "02148", "02149", "02150", "02151", "02152", "02155", "02156", "02163", "02165", 
    "02166", "02169", "02170", "02171", "02176", "02180", "02184", "02186", "02188", 
    "02189", "02190", "02191", "02193", "02194", "02196", "02199", "02201", "02203", 
    "02204", "02205", "02210", "02215", "02217", "02222", "02228", "02235", "02238", 
    "02239", "02240", "02241", "02242", "02243", "02266", "02269", "02283", "02284", 
    "02285", "02287", "02290", "02291", "02293", "02294", "02295", "02297", "02298", 
    "02301", "02302", "02303", "02304", "02305", "02322", "02324", "02325", "02327", 
    "02330", "02331", "02332", "02334", "02335", "02336", "02337", "02338", "02339", 
    "02343", "02344", "02345", "02346", "02347", "02348", "02349", "02350", "02351", 
    "02352", "02354", "02355", "02356", "02357", "02359", "02360", "02361", "02362", 
    "02363", "02364", "02366", "02368", "02370", "02375", "02378", "02379", "02380", 
    "02382", "02384", "02385", "02386", "02389", "02420", "02421", "02422", "02445", 
    "02446", "02447", "02451", "02452", "02453", "02454", "02455", "02456", "02457", 
    "02458", "02459", "02460", "02461", "02462", "02464", "02465", "02466", "02467", 
    "02468", "02472", "02474", "02476", "02478", "02481", "02482", "02493", "02532", 
    "02534", "02535", "02536", "02537", "02538", "02539", "02540", "02541", "02542", 
    "02543", "02544", "02545", "02547", "02548", "02556", "02557", "02559", "02560", 
    "02561", "02562", "02563", "02564", "02565", "02568", "02571", "02576", "02577", 
    "02584", "02586", "02601", "02602", "02603", "02630", "02631", "02632", "02633", 
    "02634", "02635", "02636", "02637", "02638", "02639", "02640", "02641", "02642", 
    "02643", "02644", "02645", "02646", "02647", "02648", "02649", "02650", "02651", 
    "02652", "02653", "02655", "02657", "02660", "02661", "02662", "02663", "02664", 
    "02666", "02667", "02668", "02670", "02671", "02673", "02674", "02675", "02676", 
    "02677", "02678", "02701", "02702", "02703", "02704", "02705", "02706", "02712", 
    "02713", "02714", "02715", "02717", "02718", "02719", "02720", "02721", "02722", 
    "02723", "02724", "02725", "02726", "02738", "02739", "02740", "02741", "02742", 
    "02743", "02744", "02745", "02746", "02747", "02748", "02760", "02762", "02763", 
    "02764", "02767", "02768", "02769", "02770", "02771", "02777", "02779", "02780", 
    "02783", "02784", "02785", "02790", "02791", "02792", "02793", "02794", "02796", 
    "02797", "02801", "02802", "02804", "02806", "02807", "02808", "02809", "02812", 
    "02813", "02814", "02815", "02816", "02817", "02818", "02822", "02823", "02824", 
    "02825", "02826", "02827", "02828", "02829", "02830", "02831", "02832", "02833", 
    "02836", "02837", "02838", "02840", "02841", "02842", "02852", "02857", "02858", 
    "02859", "02860", "02861", "02862", "02863", "02864", "02865", "02866", "02871", 
    "02872", "02873", "02874", "02876", "02877", "02878", "02879", "02880", "02881", 
    "02882", "02885", "02886", "02887", "02888", "02889", "02891", "02892", "02893", 
    "02894", "02895", "02896", "02897", "02898", "02901", "02902", "02903", "02904", 
    "02905", "02906", "02907", "02908", "02909", "02910", "02911", "02912", "02914", 
    "02915", "02916", "02917", "02918", "02919", "02920", "02921", "02940", "02941", 
    "02944", "02946", "02947", "02949", "02950", "02952", "02953", "02955", "02956", 
    "02957", "02958", "02959", "02960", "02961"
]
  


// Example zip codes

zipCodes.forEach(zipCode => fetchRecyclingLocations(zipCode));
