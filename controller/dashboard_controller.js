const conselingModel = require(`../models/index`).conseling
const teacherModel = require(`../models/index`).teacher
const offlineModel = require(`../models/index`).offline
const counselingResultModel = require('../models/index').counseling_result
const onlineModel = require('../models/index').online
const { getUserLogin } = require('../auth/auth')
const Op = require(`sequelize`).Op
const sequelize = require('../config/connect_db').sequelize

exports.upcomingAppointment = async (request, response) => {
    user = getUserLogin(request)

    try {
        const conseling = await conselingModel.findOne({
            attributes: ['id_conseling'],
            order: [['createdAt', 'DESC']],
            where: {
                isclosed: false,
                id_student: user.id_user,
            },
            include: [
                {
                    attributes: ['teacher_name'],
                    model: teacherModel,
                    required: true,
                    as: 'teacher'
                },
                {
                    attributes: ['meeting_date', 'aproval'],
                    model: offlineModel,
                    required: true,
                    where: {
                        aproval: true
                    },
                    as: 'offline'
                },
                {
                    attributes: [],
                    model: onlineModel,
                    required: true,
                    as: 'online'
                }
            ],
        });

        if (conseling) {
            return response.json({
                message: 'success',
                status: true,
                data: conseling
            });
        } else {
            return response.json({
                message: 'No upcoming appointment found for the specified student.',
                status: false,
                data: null
            });
        }
    } catch (error) {
        console.error(error);
        return response.status(500).json({
            message: 'Internal Server Error',
            status: false,
            data: null
        });
    }


    //     const { id_student } = request.params.id

    //     try{
    //     const conseling = await conselingModel.findOne({
    //         attributes: ['id_conseling'],
    //         isclosed: false,
    //         include:
    //             [
    //                 {
    //                     attributes: ['teacher_name'],
    //                     model: teacherModel,
    //                     required: true,
    //                     as: 'teacher'
    //                 },
    //                 {
    //                     attributes: ['meeting_date', 'aproval'],
    //                     model: offlineModel,
    //                     required: true,
    //                     where: {
    //                         aproval: true
    //                     },
    //                     as: 'offline'
    //                 }
    //             ],
    //     })
    //     return response.json({
    //         message: 'success',
    //         status: true,
    //         data: conseling
    //     });

};

exports.lastCounseling = async (request, response) => {
    // user = getUserLogin(request)

    // try {
    //     const conseling = await conselingModel.findOne({
    //         attributes: ['id_conseling'],
    //         where: {
    //             isclosed: false,
    //             id_student: user.id_user
    //         },
    //         order: [['createdAt', 'DESC']],
    //         include: [
    //             {
    //                 attributes: ['teacher_name'],
    //                 model: teacherModel,
    //                 required: true,
    //                 as: 'teacher'
    //             },
    //             {
    //                 attributes: ['meeting_date'],
    //                 model: offlineModel,
    //                 required: true,
    //                 as: 'offline'
    //             },
    //             {
    //                 attributes: ['rating'],
    //                 model: counselingResultModel,
    //                 required: true,
    //                 as: 'counseling_result'
    //             },
    //             {
    //                 model: onlineModel,
    //                 required: true,
    //                 as: 'online'
    //             }
    //         ],
    //     });

    //     if (conseling) {
    //         return response.json({
    //             message: 'success',
    //             status: true,
    //             data: conseling
    //         });
    //     } else {
    //         return response.json({
    //             message: 'No counseling found for the specified student.',
    //             status: false,
    //             data: null
    //         });
    //     }
    // } catch (error) {
    //     console.error(error);
    //     return response.status(500).json({
    //         message: 'Internal Server Error',
    //         status: false,
    //         data: null
    //     });
    // }



    // const conseling = await conselingModel.findOne({
    //     attributes: ['id_conseling'],
    //     isclosed: false,
    //     order: [[ 'id_conseling', 'DESC' ]],
    //     include:
    //         [
    //             {
    //                 attributes: ['teacher_name'],
    //                 model: teacherModel,
    //                 required: true,
    //                 as: 'teacher'
    //             },
    //             {
    //                 attributes: ['meeting_date'],
    //                 model: offlineModel,
    //                 required: true,
    //                 // where: {
    //                 //     aproval: true
    //                 // }
    //                 as: "offline"
    //             },
    //             {
    //                 attributes: ['rating'],
    //                 model: counselingResultModel,
    //                 required: true,
    //                 as: 'counseling_result'
    //             }
    //         ],
    // })
    // return response.json({
    //     message: 'success',
    //     status: true,
    //     data: conseling
    // });

    user = getUserLogin(request)

    let online = await sequelize.query(" SELECT teacher_name, conseling.createdAt as meeting_date  FROM conseling join teacher on teacher.id_teacher = conseling.id_teacher where  category = 'online' and isclosed = 1 UNION ALL SELECT teacher_name, meeting_date FROM conseling join teacher on teacher.id_teacher = conseling.id_teacher join offline on offline.id_conseling=conseling.id_conseling where  category = 'offline' and isclosed = 1 ORDER BY meeting_date desc ")
    return response.json({
        message: 'success',
        status: true,
        data: online[0][0],
        jumlah_data: online[0][0].length
    });
};

exports.upcomingOnline = async (request, response) => {
    // user = getUserLogin(request)

    // try {
    //     const conseling = await conselingModel.findOne({
    //         attributes: ['id_conseling', ['createdAt', 'meeting_date']],
    //         order: [['id_conseling', 'DESC']],
    //         where: {
    //             isclosed: false,
    //             id_student: user.id_user
    //         },
    //         include: [
    //             {
    //                 attributes: ['teacher_name'],
    //                 model: teacherModel,
    //                 required: true,
    //                 as: 'teacher'
    //             },
    //             // Add the onlineModel with necessary attributes and conditions if needed
    //             // {
    //             //     attributes: [['createdAt','meeting_date']],
    //             //     model: onlineModel,
    //             //     required: true,
    //             //     as: 'online'
    //             // }
    //         ],
    //     });

    //     if (conseling) {
    //         return response.json({
    //             message: 'success',
    //             status: true,
    //             data: conseling
    //         });
    //     } else {
    //         return response.json({
    //             message: 'No upcoming online counseling found for the specified student.',
    //             status: false,
    //             data: null
    //         });
    //     }
    // } catch (error) {
    //     console.error(error);
    //     return response.status(500).json({
    //         message: 'Internal Server Error',
    //         status: false,
    //         data: null
    //     });
    // }


    // const conseling = await conselingModel.findOne({
    //     attributes: ['id_conseling', ['createdAt', 'meeting_date']],
    //     order: [['id_conseling', 'DESC']],
    //     isclosed: false,
    //     include:
    //         [
    //             {
    //                 attributes: ['teacher_name'],
    //                 model: teacherModel,
    //                 required: true,
    //                 as: 'teacher'
    //             },
    //             // {
    //             //     attributes: [['createdAt','meeting_date']],
    //             //     model: onlineModel,
    //             //     required: true,
    //             //     as: 'online'
    //             // }
    //         ],
    // })
    // return response.json({
    //     message: 'success',
    //     status: true,
    //     data: conseling
    // });


    // user = getUserLogin(request)

    // try {
    //     const conseling = await conselingModel.findOne({
    //         attributes: ['id_conseling', ['createdAt', 'meeting_date']],
    //         order: [['createdAt', 'DESC']],
    //         where: {
    //             isclosed: false,
    //             id_student: user.id_user,
    //         },
    //         include: [
    //             {
    //                 attributes: ['teacher_name'],
    //                 model: teacherModel,
    //                 required: true,
    //                 as: 'teacher'
    //             },
    //             {
    //                 attributes: ['aproval'],
    //                 model: offlineModel,
    //                 required: true,
    //                 where: {
    //                     aproval: true
    //                 },
    //                 as: 'offline'
    //             },
    //             {
    //                 attributes: [],
    //                 model: onlineModel, 
    //                 required: true,
    //                 as: 'online'
    //             }
    //         ],
    //         subQuery: false, 
    //         includeIgnoreAttributes: false,
    //         subqueries: false,
    //         raw: true,
    //         nest: true
    //     });

    //     if (conseling) {
    //         const conselingWithSubquery = await conselingModel.findOne({
    //             where: { id_conseling: conseling.id_conseling },
    //             include: [
    //                 {
    //                     model: offlineModel,
    //                     required: true,
    //                     as: 'offline'
    //                 },
    //                 {
    //                     model: onlineModel,
    //                     required: true,
    //                     as: 'online'
    //                 }
    //             ]
    //         });

    //         return response.json({
    //             message: 'success',
    //             status: true,
    //             data: conselingWithSubquery
    //         });
    //     } else {
    //         return response.json({
    //             message: 'No upcoming appointment found for the specified student.',
    //             status: false,
    //             data: null
    //         });
    //     }
    // } catch (error) {
    //     console.error(error);
    //     return response.status(500).json({
    //         message: 'Internal Server Error',
    //         status: false,
    //         data: null
    //     });
    // }

    // user = getUserLogin(request)

    // try {
    //     const conseling = await conselingModel.findOne({
    //         attributes: ['id_conseling'],
    //         order: [['createdAt', 'DESC']],
    //         where: {
    //             isclosed: false,
    //             id_student: user.id_user,
    //         },
    //         include: [
    //             {
    //                 attributes: ['teacher_name'],
    //                 model: teacherModel,
    //                 required: true,
    //                 as: 'teacher'
    //             },
    //             {
    //                 attributes: ['meeting_date', 'aproval'],
    //                 model: offlineModel,
    //                 required: true,
    //                 where: {
    //                     aproval: true
    //                 },
    //                 as: 'offline'
    //             },
    //             {
    //                 attributes: [],
    //                 model: onlineModel, 
    //                 required: true,
    //                 as: 'online'
    //             }
    //         ],
    //     });

    //     if (conseling) {
    //         return response.json({
    //             message: 'success',
    //             status: true,
    //             data: conseling
    //         });
    //     } else {
    //         return response.json({
    //             message: 'No upcoming appointment found for the specified student.',
    //             status: false,
    //             data: null
    //         });
    //     }
    // } catch (error) {
    //     console.error(error);
    //     return response.status(500).json({
    //         message: 'Internal Server Error',
    //         status: false,
    //         data: null
    //     });
    // }
    user = getUserLogin(request)
    try {
        let online = await sequelize.query(" SELECT teacher_name, conseling.createdAt as meeting_date, '1' as aproval  FROM conseling join teacher on teacher.id_teacher = conseling.id_teacher where  category = 'online' and isclosed = 0 UNION ALL SELECT teacher_name, meeting_date, aproval FROM conseling join teacher on teacher.id_teacher = conseling.id_teacher join offline on offline.id_conseling=conseling.id_conseling where  category = 'offline' and isclosed = 0 ORDER BY meeting_date desc ")

        return response.json({
            message: 'success',
            status: true,
            data: online[0][0],
            jumlah_data: online[0][0].length
        });
    } catch (error) {
        return response.json({
            message: 'failed',
            status: false,
        });
    }
};

exports.lastCounselingOnline = async (request, response) => {
    user = getUserLogin(request)

    try {
        const conseling = await conselingModel.findOne({
            attributes: ['id_conseling', ['createdAt', 'meeting_date']],
            order: [['id_conseling', 'DESC']],
            where: {
                isclosed: false,
                id_student: user.id_user
            },
            include: [
                {
                    attributes: ['teacher_name'],
                    model: teacherModel,
                    required: true,
                    as: 'teacher'
                },
                {
                    attributes: ['rating'],
                    model: counselingResultModel,
                    required: true,
                    as: 'counseling_result'
                }
            ],
        });

        if (conseling) {
            return response.json({
                message: 'success',
                status: true,
                data: conseling
            });
        } else {
            return response.json({
                message: 'No last online counseling found for the specified student.',
                status: false,
                data: null
            });
        }
    } catch (error) {
        console.error(error);
        return response.status(500).json({
            message: 'Internal Server Error',
            status: false,
            data: null
        });
    }


    // const conseling = await conselingModel.findOne({
    //     attributes: ['id_conseling', ['createdAt', 'meeting_date']],
    //     order: [['id_conseling', 'DESC']],
    //     isclosed: false,
    //     include:
    //         [
    //             {
    //                 attributes: ['teacher_name'],
    //                 model: teacherModel,
    //                 required: true,
    //                 as: 'teacher'
    //             },
    //             {
    //                 attributes: ['rating'],
    //                 model: counselingResultModel,
    //                 required: true,
    //                 as: 'counseling_result'
    //             }
    //         ],
    // })
    // return response.json({
    //     message: 'success',
    //     status: true,
    //     data: conseling
    // });
};

// exports.upcomingOnline = async (request, response) => {
//     const conseling = await conselingModel.findOne({
//         attributes: ['id_conseling'],
//         include:
//             [
//                 {
//                     attributes: ['teacher_name'],
//                     model: teacherModel,
//                     required: true,
//                     as: 'teacher'
//                 },
//                 {
//                     attributes: ['meeting_date', 'aproval'],
//                     model: offlineModel,
//                     required: true,
//                     // where: {
//                     //     aproval: true
//                     // },
//                     as: 'offline'
//                 }
//             ],
//     })
//     return response.json({
//         message: 'success',
//         status: true,
//         data: conseling
//     });
// }

exports.countOffline = async (request, response) => {

    try {
        let countOffline = await conselingModel.findAll({
            where: {
                category: 'offline',
                isclosed: false,
            }, include: [
                {
                    model: offlineModel,
                    as: 'offline',
                    where: {
                        aproval: null
                    }
                }
            ]
        })
        return response.json({
            success: true,
            data_count: countOffline.length,
            message: `All offline have been loaded`,
        });
    } catch (error) {
        console.error('Error in getAllResult:', error);
        return response.status(500).json({
            success: false,
            data: null,
            message: 'Internal Server Error',
        });
    }
}

exports.countOnline = async (request, response) => {
    user = getUserLogin(request)

    try {
        let countOnline = await conselingModel.findAll({
            where: {
                category: 'online',
                isclosed: false,
                id_teacher: user.id_user
            },
        })
        return response.json({
            success: true,
            data_count: countOnline.length,
            message: `All online have been loaded`,
        });
    } catch (error) {
        console.error('Error in getAllResult:', error);
        return response.status(500).json({
            success: false,
            data: null,
            message: 'Internal Server Error',
        });
    }
}