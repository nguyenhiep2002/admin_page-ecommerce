import { environment } from '../../environments/environment'

export class Constants {
    public static Router_Login = '/authentication/login'
    public static LoginUrl = 'sts/getaccesstoken'

    private static _config: any = environment

    public static setConfig(json) {
        Constants._config = json
    }

    public static getConfig(key) {
        return Constants._config[key]
    }

    public static ApiResources = {
        Role: {
            Resource: 'smt/api/roles'
        },
        Menu: {
            Resource: 'smt/api/usermenus',
            GetMyMenuUrl: 'getMyMenus'
        },
        User: {
            Resource: 'smt/api/users',
            GetMyProfile: 'getMyProfile'
        },
        Function: {
            Resource: 'smt/api/functions'
        },
        Application: {
            Resource: 'smt/api/applications'
        },
        Action: {
            Resource: 'smt/api/useractions'
        },
        SystemConfig: {
            Resource: 'smt/api/systemconfigs',
            UpdateValues: 'UpdateValues'
        },
        ForgotPassword: {
            Resource: 'smt/api/users/forgotpassword'
        },
        SignUp: {
            Resource: 'lis/api/customer',
            Register: 'register'
        },
        File: {
            Resource: 'fs/uploads'
        },
        ViewFiles: {
            Resource: 'pfs',
            ResourceImage: 'pfs/viewImgById/'
        },
        Branch: {
            Resource: 'lis/api/branch'
        },
        ProcessCode: {
            Resource: 'lis/api/processCode'
        },
        Manufactory: {
            Resource: 'lis/api/manufactory'
        },
        // ADP--------------
        Category: {
            Resource: 'qc/api/category'
        },
        CategoryType: {
            Resource: 'qc/api/categoryType'
        },
        Device: {
            Resource: 'adp/api/device'
        },
        TestType: {
            Resource: 'adp/api/testType'
        },
        StandardTest: {
            Resource: 'adp/api/standardTest',
            GetByTestTypeId: 'GetByTestTypeId',
            UpdatePosition: 'UpdatePositions'
        },

        DeviceTestCode: {
            Resource: 'adp/api/deviceTestCode'
        },
        WorkSpace: {
            Resource: 'adp/api/WorkSpace'
        },
        Deepcare: {
            Resource: 'adp/api/Deepcare'
        },
        Result: {
            Resource: 'adp/api/result'
        },
        ResultDetail: {
            Resource: 'adp/api/ResultDetail'
        },
        Study: {
            Resource: 'adp/api/Study'
        },
        Seri: {
            Resource: 'adp/api/Seri'
        }
    }
}
