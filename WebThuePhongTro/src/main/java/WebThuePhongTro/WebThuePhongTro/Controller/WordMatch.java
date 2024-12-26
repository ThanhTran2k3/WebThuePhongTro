package WebThuePhongTro.WebThuePhongTro.Controller;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class WordMatch {
    public static void main(String[] args) {
        String paragraph = "Java là một ngôn ngữ lập trình bậc cao. Nó mạnh mẽ và rất phổ biến. Nhiều người sử dụng Java cho phát triển ứng dụng web.";
        String query = "ngôn ngữ lập trình mạnh mẽ";

        // Tách đoạn văn thành từng từ và tách câu yêu cầu
        List<String> wordsInParagraph = splitIntoWords(paragraph);
        List<String> wordsInQuery = splitIntoWords(query);

        // Tính số từ chung giữa đoạn văn và câu yêu cầu
        int commonWords = calculateCommonWords(wordsInParagraph, wordsInQuery);

        // Tính phần trăm tương thích
        double similarity = (double) commonWords / wordsInQuery.size() * 100;

        // Kết quả
        System.out.printf("Số từ chung: %d\n", commonWords);
        System.out.printf("Độ tương thích: %.2f%%\n", similarity);
    }

    // Hàm tách thành từ
    public static List<String> splitIntoWords(String text) {
        return Arrays.asList(text.toLowerCase().split("\\s+"));
    }

    // Hàm tính số từ chung
    public static int calculateCommonWords(List<String> paragraphWords, List<String> queryWords) {
        Set<String> paragraphSet = new HashSet<>(paragraphWords);
        Set<String> querySet = new HashSet<>(queryWords);
        paragraphSet.retainAll(querySet);

        return paragraphSet.size();
    }
}