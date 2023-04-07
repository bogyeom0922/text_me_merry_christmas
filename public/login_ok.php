<?php
session_start();

$connect = mysqli_connect("localhost", "root", "0922", "textmechristmas") or die("MySQL 접속 실패!!");

//입력 받은 id와 password
$id = $_POST['id'];
$password = $_POST['password'];

//아이디가 있는지 검사
$query = "select * from user where id='$Use_id'";
$result = $connect->query($query);


//아이디가 있다면 비밀번호 검사
if (mysqli_num_rows($result) == 1) {

    $row = mysqli_fetch_assoc($result);

    //비밀번호가 맞다면 세션 생성
    if ($row['password'] == $password) {    //password 평문비교 취약!
        $_SESSION['id'] = $id;
        if (isset($_SESSION['id'])) {
?> <script>
                location.replace("/index");
            </script>
        <?php
        } else {
            echo "session failed";
        }
    } else {
        ?> <script>
            alert("아이디 또는 비밀번호를 확인해주세요.");
            history.back(); //js 이 전페이지(login.php)로 돌아가기
        </script>
    <?php
    }
} else {
    ?> <script>
        alert("아이디 또는 비밀번호를 확인해주세요.");
        history.back();
    </script>
<?php
}
?>