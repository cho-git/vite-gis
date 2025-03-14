export function activeLable() {
    document.querySelectorAll('.cart_btn').forEach(btn => {
        btn.addEventListener('click', function () {
            // 모든 버튼에서 'active' 클래스와 'aria-current' 제거
            document.querySelectorAll('.cart_btn').forEach(el => {
                el.classList.remove("active");
                el.removeAttribute("aria-current");
            });

            // 클릭한 버튼만 활성화
            this.classList.add("active");
            this.setAttribute("aria-current", "true");
        });
    });
}