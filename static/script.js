// Fetch data from the '/api/train_ferry_info' endpoint.
fetch('/api/train_ferry_info')
    .then(response => response.json()) // Parse the JSON response.
    .then(data => {
        // Get the container element by its ID.
        const container = document.getElementById('announcements');

        // Clear the container to prepare for new content.
        container.innerHTML = '';

        //make time format more readable
        function formatDateTime(dateTimeString){
            const options = {
                year: 'numeric',
                month:'long', 
                day:'numeric',
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit', 
                timeZoneName: 'short' 
            };
            return new Date(dateTimeString).toLocaleDateString(undefined, options)
        }

        // Process TrainAnnouncement
        const trainAnnouncements = data.RESPONSE.RESULT[0].TrainAnnouncement;
        if (trainAnnouncements && trainAnnouncements.length > 0) {
            // Create a heading for train announcements.
            const trainHeading = document.createElement('h2');
            trainHeading.textContent = 'Train Announcements';
            container.appendChild(trainHeading);

            // Iterate through train announcements and display them.
            trainAnnouncements.forEach(announcement => {
                const announcementDiv = document.createElement('div');
                announcementDiv.innerHTML = `
                    <strong>Train Number:</strong> ${announcement.AdvertisedTrainIdent} <br>
                    <strong>Location:</strong> ${announcement.LocationSignature} <br>
                    <strong>Scheduled Departure:</strong> ${formatDateTime(announcement.ScheduledDepartureDateTime)} <br>
                    <strong>Is Advertised:</strong> ${announcement.Advertised} <br>
                    <strong>Is Canceled:</strong> ${announcement.Canceled} <br>
                    <hr>
                `;
                container.appendChild(announcementDiv);
            });
        }
        // Process FerryAnnouncement
        const ferryAnnouncements = data.RESPONSE.RESULT[1].FerryAnnouncement;
        if (ferryAnnouncements && ferryAnnouncements.length > 0) {
            // Create a heading for ferry announcements.
            const ferryHeading = document.createElement('h2');
            ferryHeading.textContent = 'Ferry Announcements';
            container.appendChild(ferryHeading);
            // Iterate through ferry announcements and display them.
            ferryAnnouncements.forEach(announcement => {
                const announcementDiv = document.createElement('div');
                announcementDiv.innerHTML = `
                    <strong>From:</strong> ${announcement.FromHarbor.Name} (ID: ${announcement.FromHarbor.Id}) <br>
                    <strong>To:</strong> ${announcement.ToHarbor.Name} <br>
                    <strong>Route:</strong> ${announcement.Route.Name} <br>
                    <strong>Departure Time:</strong> ${formatDateTime(announcement.DepartureTime)} <br>
                    <hr>
                `;
                container.appendChild(announcementDiv);
            });
        }
    })
    .catch(error => console.error('Error fetching data:', error)); // Handle errors.
