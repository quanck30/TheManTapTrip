import { useNavigate } from "react-router-dom";
import Home from "../pages/home";

const HomeRoute = () => {
    const navigate = useNavigate();

    const handleDiagnoseComplete = (results) => {
        // 💡 取得したデータ階層に合わせて、配列部分だけを抽出して渡します
        // APIレスポンスが { data: [...] } か、いきなり [...] で来るケース両方に対応
        const placesData =
            results?.data?.places || results?.data || results || [];

        // recommendページへ遷移し、裏側で placesData を渡す
        navigate("/recommend", { state: { places: placesData } });
    };

    return <Home onDiagnoseComplete={handleDiagnoseComplete} />;
};

export default HomeRoute;
