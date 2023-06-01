import { useLocation } from "react-router-dom";

function Search() {
    // location : 지금 있는 곳에 관한 정보를 얻을 수 있다
    const loaction = useLocation();

    // URLSearchParams : url에서 특정 쿼리 문자열을 가져오거나 수정할 때 사용
    const keyword = new URLSearchParams(loaction.search).get("keyword");

    return null;
}

export default Search;

// 1. 더많은 api  / 2. 검색 결과 화면 / 3. header 컴포넌트 카테고리 완성 / 4. css 완성