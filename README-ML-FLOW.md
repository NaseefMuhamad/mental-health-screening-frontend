# Updated assessment screens

New Screening now captures heart rate only. Historical blood pressure and pupil measurements remain preserved in the database, but are not inputs to this demonstration model.

Open a submitted screening as its assigned counsellor and choose Begin review. The details page then offers a demo contextual assessment: sleep hours, screen time, assignment load, exam pressure and social support. The supported ranges are explicitly labeled dataset ranges; the questions are not presented as a validated clinical instrument. Course/year and recorded heart rate are added by the backend to a saved snapshot.

After saving, Generate stress and anxiety estimates requests the selected pipelines through FastAPI. It displays separate categories plus model version/time. All counsellors can read submitted-screening categories, but only the assignee can collect the private assessment or generate results. Changing inputs preserves old records and requires a new prediction.

No model has been activated yet. Until the full comparison is run and the local ML service starts, prediction generation will explain that inference is unavailable. The frontend does not invent placeholder category values.

Existing login/session restoration, role navigation, staff invitations, student records, counselling and follow-ups remain connected to the backend.
