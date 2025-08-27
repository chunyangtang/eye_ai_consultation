import React, { useState, useEffect, useCallback, useMemo } from 'react'; // Added useCallback and useMemo
import { Phone, User, Eye, AlarmClock, ClipboardCheck, History, XCircle, CheckCircle, WifiOff } from 'lucide-react'; // Importing icons, added WifiOff

// Eye-specific questions component moved outside App for better performance
const EyeSpecificQuestions = React.memo(({ eyeName, eyeData, onEyeChange, onEyeMultiselectChange, sectionTitle, errors = {} }) => {
    // Ensure eyeData is initialized if it's null
    const currentEyeData = useMemo(() => eyeData || {}, [eyeData]);

    return (
        <div className="p-6 bg-blue-50 rounded-lg shadow-inner mt-6 border border-blue-200">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">{sectionTitle}</h3>

            {/* Question 2 */}
            <div className="mb-6">
                <label className="block text-lg font-medium text-gray-800 mb-2 flex items-center">
                    <AlarmClock className="mr-2 text-blue-600" size={20} />
                    【问题 2】主要症状识别
                    {errors[`${eyeName}MainSymptom`] && (
                        <span className="text-red-500 text-sm ml-2">{errors[`${eyeName}MainSymptom`]}</span>
                    )}
                </label>
                <p className="text-sm text-gray-600 mb-3">请问您就诊的主要症状是什么？（选择一个最主要的）</p>
                {['A. 视物模糊/视力下降', 'B. 眼前出现漂浮物、黑影飘动', 'C. 闪光感/水波纹/视物遮挡', 'D. 眼红/充血/分泌物增多/眼痒', 'E. 眼睛干涩/异物感/疲劳', 'F. 眼睛长了小疙瘩/肿物（眼睑/角膜（黑眼球表面）/结膜（白眼球表面））', 'G. 眼痛/眼眶痛', 'H. 眼球突出', 'I. 其他（请简述）'].map((option, index) => (
                    <div key={option} className="mb-2">
                        <input
                            type="radio"
                            id={`${eyeName}-mainSymptom-${index}`}
                            name={`${eyeName}-mainSymptom`}
                            value={option.split('.')[0]}
                            checked={currentEyeData.mainSymptom === option.split('.')[0]}
                            onChange={(e) => onEyeChange(eyeName, 'mainSymptom', e.target.value)}
                            className="mr-2 accent-blue-600"
                        />
                        <label htmlFor={`${eyeName}-mainSymptom-${index}`} className="text-gray-700">{option}</label>
                    </div>
                ))}
                
                {/* Moved the conditional input outside the map to prevent re-rendering issues */}
                {currentEyeData.mainSymptom === 'I' && (
                    <div className="mb-2">
                        <input
                            type="text"
                            name={`${eyeName}-mainSymptom-other`}
                            value={currentEyeData.mainSymptomOther || ''}
                            onChange={(e) => onEyeChange(eyeName, 'mainSymptomOther', e.target.value)}
                            placeholder="请简述其他症状"
                            className="ml-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-1/2"
                        />
                    </div>
                )}
            </div>

            {/* Question 3 */}
            <div className="mb-6">
                <label className="block text-lg font-medium text-gray-800 mb-2 flex items-center">
                    <AlarmClock className="mr-2 text-blue-600" size={20} />
                    【问题 3】症状起病方式及时间
                    {errors[`${eyeName}OnsetMethod`] && (
                        <span className="text-red-500 text-sm ml-2">{errors[`${eyeName}OnsetMethod`]}</span>
                    )}
                    {errors[`${eyeName}OnsetTime`] && (
                        <span className="text-red-500 text-sm ml-2">{errors[`${eyeName}OnsetTime`]}</span>
                    )}
                </label>
                <p className="text-sm text-gray-600 mb-3">症状是如何出现的？（请具体输入出现时间）</p>
                {['A. 突发性（数小时内迅速出现）', 'B. 渐进性（数天或更长时间缓慢加重）'].map((option, index) => (
                    <div key={option} className="mb-2">
                        <input
                            type="radio"
                            id={`${eyeName}-onsetMethod-${index}`}
                            name={`${eyeName}-onsetMethod`}
                            value={option.split('.')[0]}
                            checked={currentEyeData.onsetMethod === option.split('.')[0]}
                            onChange={(e) => onEyeChange(eyeName, 'onsetMethod', e.target.value)}
                            className="mr-2 accent-blue-600"
                        />
                        <label htmlFor={`${eyeName}-onsetMethod-${index}`} className="text-gray-700">{option}</label>
                    </div>
                ))}
                {currentEyeData.onsetMethod && (
                    <input
                        type="text"
                        name={`${eyeName}-onsetTime`}
                        value={currentEyeData.onsetTime || ''}
                        onChange={(e) => onEyeChange(eyeName, 'onsetTime', e.target.value)}
                        placeholder="请具体输入出现时间，例如：昨天下午"
                        className="mt-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    />
                )}
            </div>

            {/* Question 4 */}
            <div className="mb-6">
                <label className="block text-lg font-medium text-gray-800 mb-2 flex items-center">
                    <ClipboardCheck className="mr-2 text-blue-600" size={20} />
                    【问题 4】伴随其他症状
                    {errors[`${eyeName}AccompanyingSymptoms`] && (
                        <span className="text-red-500 text-sm ml-2">{errors[`${eyeName}AccompanyingSymptoms`]}</span>
                    )}
                </label>
                <p className="text-sm text-gray-600 mb-3">在主要症状之外，您是否存在以下任一症状？（可多选）</p>
                {[
                    'A. 畏光/怕光', 'B. 眼部分泌物异常（浑浊或脓性分泌物）', 'C. 眼部有异物感或疼痛',
                    'D. 眼部肿胀', 'E. 头痛/恶心呕吐', 'F. 复视（如把一个东西看成两个）',
                    'G. 视野缺损（如周边看不见）', 'H. 视物变形（如看东西直线变弯）', 'I. 眼球运动障碍',
                    'J. 看灯光有彩虹样光环', 'K. 眼前红色烟雾样遮挡', 'L. 色觉异常（看东西分不清颜色）',
                    'M. 无其他明显症状'
                ].map((option, index) => (
                    <div key={option} className="mb-2">
                        <input
                            type="checkbox"
                            id={`${eyeName}-accompanyingSymptoms-${index}`}
                            name={`${eyeName}-accompanyingSymptoms`}
                            value={option.split('.')[0]}
                            checked={(currentEyeData.accompanyingSymptoms || []).includes(option.split('.')[0])}
                            onChange={(e) => onEyeMultiselectChange(eyeName, 'accompanyingSymptoms', e.target.value, e.target.checked)}
                            className="mr-2 accent-blue-600"
                        />
                        <label htmlFor={`${eyeName}-accompanyingSymptoms-${index}`} className="text-gray-700">{option}</label>
                    </div>
                ))}
            </div>

            {/* Question 5 */}
            <div className="mb-6">
                <label className="block text-lg font-medium text-gray-800 mb-2 flex items-center">
                    <History className="mr-2 text-blue-600" size={20} />
                    【问题 5】既往病史及诱因
                    {errors[`${eyeName}MedicalHistory`] && (
                        <span className="text-red-500 text-sm ml-2">{errors[`${eyeName}MedicalHistory`]}</span>
                    )}
                </label>
                <p className="text-sm text-gray-600 mb-3">在症状发生前，您是否有以下情况？</p>
                {[
                    'A. 近期外伤、眼部手术或接触化学物质', 'B. 有高血压、糖尿病等全身疾病史',
                    'C. 长期戴隐形眼镜或屈光不正史', 'D. 长期屏幕使用史', 'E. 无明显诱因或既往病史'
                ].map((option, index) => (
                    <div key={option} className="mb-2">
                        <input
                            type="radio"
                            id={`${eyeName}-medicalHistory-${index}`}
                            name={`${eyeName}-medicalHistory`}
                            value={option.split('.')[0]}
                            checked={currentEyeData.medicalHistory === option.split('.')[0]}
                            onChange={(e) => onEyeChange(eyeName, 'medicalHistory', e.target.value)}
                            className="mr-2 accent-blue-600"
                        />
                        <label htmlFor={`${eyeName}-medicalHistory-${index}`} className="text-gray-700">{option}</label>
                    </div>
                ))}
            </div>
        </div>
    );
});

// Main App component
const App = () => {
    // State to store form data
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        affectedArea: [], // Now an array to handle multiple selections
        leftEye: null,
        rightEye: null,
        bothEyes: null, // New state for 'both' option
    });

    // State for form validation errors
    const [errors, setErrors] = useState({});
    // State for submission status (loading, success, error)
    const [submitStatus, setSubmitStatus] = useState(null); // 'loading', 'success', 'error'
    // State to store detailed error message for submission
    const [submissionErrorMessage, setSubmissionErrorMessage] = useState('');

    // Function to handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'affectedArea') {
            setFormData(prevData => {
                let updatedAreas = [];
                if (value === 'both') {
                    // If 'both' is checked, it's the only selection
                    updatedAreas = checked ? ['both'] : [];
                } else {
                    // If 'left' or 'right' is checked/unchecked
                    // Remove 'both' if it was selected and another eye is being chosen/unchosen
                    const currentAreasWithoutBoth = prevData.affectedArea.filter(area => area !== 'both');

                    if (checked) {
                        updatedAreas = [...currentAreasWithoutBoth, value];
                    } else {
                        updatedAreas = currentAreasWithoutBoth.filter(item => item !== value);
                    }
                }
                return { ...prevData, [name]: updatedAreas };
            });
        } else if (type === 'checkbox') {
            // For multiselect checkboxes other than affectedArea
            setFormData(prevData => {
                const currentValues = prevData[name] || [];
                if (checked) {
                    return { ...prevData, [name]: [...currentValues, value] };
                } else {
                    return { ...prevData, [name]: currentValues.filter(item => item !== value) };
                }
            });
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    // Using useCallback to memoize these functions, preventing their re-creation on every App render.
    // This isn't strictly necessary for the focus bug (key is more important),
    // but it's good practice for performance with child components.
    const handleEyeSpecificChange = useCallback((eye, question, value) => {
        setFormData(prevData => ({
            ...prevData,
            [eye]: {
                ...prevData[eye],
                [question]: value
            }
        }));
    }, []);

    const handleEyeSpecificMultiselectChange = useCallback((eye, question, value, checked) => {
        setFormData(prevData => {
            const currentEyeData = prevData[eye] || {};
            const currentQuestionValues = currentEyeData[question] || [];
            let updatedValues;
            if (checked) {
                updatedValues = [...currentQuestionValues, value];
            } else {
                updatedValues = currentQuestionValues.filter(item => item !== value);
            }
            return {
                ...prevData,
                [eye]: {
                    ...currentEyeData,
                    [question]: updatedValues
                }
            };
        });
    }, []);

    // Validation function
    const validateForm = () => {
        let newErrors = {};
        if (formData.name.length < 2) {
            newErrors.name = '姓名至少需要2个字符';
        }
        // Updated phone number validation: just checks if it's digits and not empty if required
        if (!/^\d+$/.test(formData.phone)) {
            newErrors.phone = '联系电话需要为数字';
        }
        if (formData.affectedArea.length === 0) {
            newErrors.affectedArea = '请选择受累部位';
        }

        // Validate eye-specific questions if applicable
        const validateEyeQuestions = (eyeData, eyeName) => {
            if (!eyeData) return;
            if (!eyeData.mainSymptom) newErrors[`${eyeName}MainSymptom`] = '请选择主要症状';
            if (!eyeData.onsetMethod) newErrors[`${eyeName}OnsetMethod`] = '请选择症状起病方式';
            if (eyeData.onsetMethod && !eyeData.onsetTime) newErrors[`${eyeName}OnsetTime`] = '请填写出现时间';
            // Only require accompanyingSymptoms if 'M. 无其他明显症状' is not selected.
            // If 'M' is selected, other symptoms are not expected.
            // This is a more robust check for `M` being the only selection
            const hasAccompanyingSymptoms = eyeData.accompanyingSymptoms && eyeData.accompanyingSymptoms.length > 0;
            const hasOnlyNoOtherSymptoms = hasAccompanyingSymptoms && eyeData.accompanyingSymptoms.length === 1 && eyeData.accompanyingSymptoms.includes('M');

            if (!hasAccompanyingSymptoms && !hasOnlyNoOtherSymptoms) {
                 newErrors[`${eyeName}AccompanyingSymptoms`] = '请选择伴随症状';
            } else if (hasAccompanyingSymptoms && eyeData.accompanyingSymptoms.includes('M') && eyeData.accompanyingSymptoms.length > 1) {
                newErrors[`${eyeName}AccompanyingSymptoms`] = '选择“无其他明显症状”时不能选择其他伴随症状';
            }


            if (!eyeData.medicalHistory) newErrors[`${eyeName}MedicalHistory`] = '请选择既往病史及诱因';
        };

        if (formData.affectedArea.includes('both')) {
            validateEyeQuestions(formData.bothEyes, 'bothEyes');
        } else {
            if (formData.affectedArea.includes('left')) {
                validateEyeQuestions(formData.leftEye, 'leftEye');
            }
            if (formData.affectedArea.includes('right')) {
                validateEyeQuestions(formData.rightEye, 'rightEye');
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus('loading');
        setSubmissionErrorMessage(''); // Clear previous error messages

        // Run validation and store its result
        const isValid = validateForm();

        if (isValid) {
            try {
                const dataToSend = { ...formData };

                // Adjust dataToSend based on affectedArea
                if (dataToSend.affectedArea.includes('both')) {
                    dataToSend.leftEye = null; // Clear individual eye data
                    dataToSend.rightEye = null;
                    if (!dataToSend.bothEyes) dataToSend.bothEyes = {}; // Ensure it's an object
                } else {
                    dataToSend.bothEyes = null; // Clear bothEyes data
                    if (dataToSend.affectedArea.includes('left') && !dataToSend.leftEye) dataToSend.leftEye = {};
                    if (dataToSend.affectedArea.includes('right') && !dataToSend.rightEye) dataToSend.rightEye = {};
                }

                // Get the current host dynamically for cross-device access
                const currentHost = window.location.hostname;
                const apiUrl = `http://${currentHost}:8001/submit-questionnaire`;
                
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataToSend),
                });

                if (response.ok) {
                    setSubmitStatus('success');
                    // Optionally reset form after successful submission
                    setFormData({
                        name: '',
                        phone: '',
                        affectedArea: [],
                        leftEye: null,
                        rightEye: null,
                        bothEyes: null,
                    });
                    setErrors({}); // Clear errors on success
                    setTimeout(() => setSubmitStatus(null), 3000); // Clear status after 3 seconds
                } else {
                    const errorData = await response.json();
                    console.error('Submission failed:', errorData.message);
                    setSubmissionErrorMessage(errorData.message || '提交失败，请检查填写信息！'); // Display backend error
                    setSubmitStatus('error');
                    setTimeout(() => {
                        setSubmitStatus(null);
                        setSubmissionErrorMessage('');
                    }, 5000); // Clear status and message after 5 seconds
                }
            } catch (error) {
                console.error('Network error:', error);
                setSubmissionErrorMessage('无法连接到服务器，请检查网络设置或后端是否运行。'); // Detailed network error
                setSubmitStatus('error');
                setTimeout(() => {
                    setSubmitStatus(null);
                    setSubmissionErrorMessage('');
                }, 5000); // Clear status and message after 5 seconds
            }
        } else {
            // Collect all validation errors and display them as a single message
            // Use the 'errors' state, which is updated by validateForm()
            const allErrors = Object.values(errors).filter(msg => msg).join('; '); // Filter out empty strings
            setSubmissionErrorMessage(`请检查以下问题：${allErrors}`);
            setSubmitStatus('error'); // Set error status if validation fails
            setTimeout(() => {
                setSubmitStatus(null);
                setSubmissionErrorMessage('');
            }, 5000); // Clear status and message after 5 seconds
        }
    };

    // Initialize/clear eye-specific data when affectedArea changes
    const affectedAreaString = useMemo(() => JSON.stringify(formData.affectedArea), [formData.affectedArea]);
    
    useEffect(() => {
        setFormData(prevData => {
            const newFormData = { ...prevData };
            const { affectedArea } = newFormData;

            // Define default empty object for new eye sections
            const defaultEyeData = {
                mainSymptom: '', onsetMethod: '', onsetTime: '', accompanyingSymptoms: [], medicalHistory: '', mainSymptomOther: ''
            };

            if (affectedArea.includes('both')) {
                newFormData.leftEye = null;
                newFormData.rightEye = null;
                // Only initialize if bothEyes is null, otherwise keep existing object
                if (!newFormData.bothEyes) {
                    newFormData.bothEyes = defaultEyeData;
                }
            } else {
                newFormData.bothEyes = null; // Clear bothEyes if 'both' is not selected

                if (!affectedArea.includes('left')) {
                    newFormData.leftEye = null;
                } else if (!newFormData.leftEye) { // Only initialize if leftEye is null
                    newFormData.leftEye = defaultEyeData;
                }

                if (!affectedArea.includes('right')) {
                    newFormData.rightEye = null;
                } else if (!newFormData.rightEye) { // Only initialize if rightEye is null
                    newFormData.rightEye = defaultEyeData;
                }
            }
            return newFormData;
        });
    }, [affectedAreaString]); // Use the memoized string as dependency



    return (
        <div className="min-h-screen bg-gray-100 p-4 font-inter">
            {/* Tailwind CSS Script - Always include this in the head of your HTML or a script tag */}
            <script src="https://cdn.tailwindcss.com"></script>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />

            {/* Header */}
            <header className="bg-white shadow-md p-4 mb-6 rounded-lg flex items-center justify-center">
                <div className="flex items-center"> {/* Container for logo and title */}
                    {/* Replaced the div with an img tag for the logo */}
                    <img
                        src="/TsinghuaLogo.svg" // Changed to /TsinghuaLogo.svg
                        alt="Tsinghua Logo"
                        className="w-14 h-14 rounded-full mr-4 shadow-inner object-cover" // Maintain circular and sizing
                        onError={(e) => { // Optional: Add an error handler for the image
                            e.target.onerror = null; // Prevent infinite loop if fallback also fails
                            e.target.src = "https://placehold.co/56x56/507BCE/FFFFFF?text=Logo"; // Fallback placeholder
                            console.warn("Local logo not found, falling back to placeholder.");
                        }}
                    />
                    <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight whitespace-nowrap">
                        AI Eye Clinic 问诊系统
                    </h1>
                </div>
            </header>

            <main className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-xl">
                <form onSubmit={handleSubmit}>
                    {/* Basic Information */}
                    <div className="mb-8 p-6 bg-blue-50 rounded-lg shadow-inner border border-blue-200">
                        <h2 className="text-2xl font-bold text-blue-700 mb-4">基本信息</h2>

                        {/* Name Input */}
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-lg font-medium text-gray-800 mb-2 flex items-center">
                                <User className="mr-2 text-blue-600" size={20} />
                                姓名:
                                {errors.name && <span className="text-red-500 text-sm ml-2">{errors.name}</span>}
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                                placeholder="请输入您的姓名 (至少2个字符)"
                                minLength="2"
                                required
                            />
                        </div>

                        {/* Phone Input */}
                        <div className="mb-4">
                            <label htmlFor="phone" className="block text-lg font-medium text-gray-800 mb-2 flex items-center">
                                <Phone className="mr-2 text-blue-600" size={20} />
                                联系电话:
                                {errors.phone && <span className="text-red-500 text-sm ml-2">{errors.phone}</span>}
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                                placeholder="请输入联系电话"
                                pattern="\d*" // Removed 11-digit restriction, now allows any digits
                                required
                            />
                        </div>
                    </div>

                    {/* Question 1 */}
                    <div className="mb-8 p-6 bg-blue-50 rounded-lg shadow-inner border border-blue-200">
                        <label className="block text-xl font-bold text-blue-700 mb-4 flex items-center">
                            <Eye className="mr-2 text-blue-600" size={24} />
                            【问题 1】受累部位
                            {errors.affectedArea && <span className="text-red-500 text-sm ml-2">{errors.affectedArea}</span>}
                        </label>
                        <p className="text-gray-700 mb-3">请问您的症状主要集中在：</p>
                        <p className="text-sm text-gray-600 mb-4">如双眼症状一致则请选择的双眼，若存在不同症状请选择左眼+右眼</p>
                        <div className="flex flex-col space-y-3">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="affectedArea-left"
                                    name="affectedArea"
                                    value="left"
                                    checked={formData.affectedArea.includes('left')}
                                    onChange={handleChange}
                                    className="mr-2 accent-blue-600"
                                />
                                <label htmlFor="affectedArea-left" className="text-gray-700 text-base">A. 左眼</label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="affectedArea-right"
                                    name="affectedArea"
                                    value="right"
                                    checked={formData.affectedArea.includes('right')}
                                    onChange={handleChange}
                                    className="mr-2 accent-blue-600"
                                />
                                <label htmlFor="affectedArea-right" className="text-gray-700 text-base">B. 右眼</label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="affectedArea-both"
                                    name="affectedArea"
                                    value="both"
                                    checked={formData.affectedArea.includes('both')}
                                    onChange={handleChange}
                                    className="mr-2 accent-blue-600"
                                />
                                <label htmlFor="affectedArea-both" className="text-gray-700 text-base">C. 双眼</label>
                            </div>
                        </div>
                    </div>
                    {/* Conditional Eye-Specific Questions */}
                    {formData.affectedArea.includes('both') && (
                        <EyeSpecificQuestions
                            key="both-eyes-form" // Added stable key
                            eyeName="bothEyes"
                            eyeData={formData.bothEyes}
                            onEyeChange={handleEyeSpecificChange}
                            onEyeMultiselectChange={handleEyeSpecificMultiselectChange}
                            sectionTitle="双眼症状"
                            errors={errors}
                        />
                    )}

                    {!formData.affectedArea.includes('both') && formData.affectedArea.includes('left') && (
                        <EyeSpecificQuestions
                            key="left-eye-form" // Added stable key
                            eyeName="leftEye"
                            eyeData={formData.leftEye}
                            onEyeChange={handleEyeSpecificChange}
                            onEyeMultiselectChange={handleEyeSpecificMultiselectChange}
                            sectionTitle="左眼症状"
                            errors={errors}
                        />
                    )}

                    {!formData.affectedArea.includes('both') && formData.affectedArea.includes('right') && (
                        <EyeSpecificQuestions
                            key="right-eye-form" // Added stable key
                            eyeName="rightEye"
                            eyeData={formData.rightEye}
                            onEyeChange={handleEyeSpecificChange}
                            onEyeMultiselectChange={handleEyeSpecificMultiselectChange}
                            sectionTitle="右眼症状"
                            errors={errors}
                        />
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={`mt-8 w-full py-3 px-6 text-white text-lg font-semibold rounded-lg shadow-lg transform transition duration-300
                            ${submitStatus === 'loading' ? 'bg-blue-400 cursor-not-allowed' :
                              submitStatus === 'success' ? 'bg-green-600 hover:bg-green-700 scale-105' :
                              submitStatus === 'error' ? 'bg-red-500 hover:bg-red-600 scale-105' :
                              'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 scale-100 hover:scale-105'}
                            focus:outline-none focus:ring-4 focus:ring-blue-300`}
                        disabled={submitStatus === 'loading'}
                    >
                        {submitStatus === 'loading' && '提交中...'}
                        {submitStatus === 'success' && (
                            <span className="flex items-center justify-center">
                                <CheckCircle className="mr-2" size={20} /> 提交成功！
                            </span>
                        )}
                        {submitStatus === 'error' && (
                            <span className="flex items-center justify-center">
                                <XCircle className="mr-2" size={20} /> 提交失败
                            </span>
                        )}
                        {!submitStatus && '提交问卷'}
                    </button>

                    {/* Submission Error Message Display */}
                    {submitStatus === 'error' && submissionErrorMessage && (
                        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center justify-center text-center">
                            <XCircle className="mr-2" size={20} /> {submissionErrorMessage}
                        </div>
                    )}
                </form>
            </main>
        </div>
    );
};

export default App;
