import { useNavigate } from "react-router-dom";
import Home from "../pages/Home";
import { usePlaces } from "../hooks/usePlaces";

const HomeRoute = () => {
    const navigate = useNavigate();
    const { setPlaces } = usePlaces();

    const handleDiagnoseComplete = (results) => {
        // 💡 取得したデータ階層に合わせて、配列部分だけを抽出して渡します
        // APIレスポンスが { data: [...] } か、いきなり [...] で来るケース両方に対応
        const placesData =
            results?.data?.places || results?.data || results || [];

        // 検索結果をコンテキストに保存してから recommend ページへ遷移
        setPlaces(placesData);
        navigate("/recommend");
    };

    return <Home onDiagnoseComplete={handleDiagnoseComplete} />;
};

export default HomeRoute;
