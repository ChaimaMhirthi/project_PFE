const {createMission,getAllMissions,updateMission  ,deleteMission,getMyMissions} = require('../controller/missions');

const router = require('express').Router();
router.post('/create-mission', createMission);

router.get('/get-allmissions', getAllMissions);
router.post('/update-mission/:missionId', updateMission);
router.delete('/delete-mission/:missionId', deleteMission);
router.get('/get-mymissions', getMyMissions);


module.exports = router;