"use strict";
/*** REGION 1 - Global variables - Vùng khai báo biến, hằng số, tham số TOÀN CỤC */
const gSMALL = "Small";
const gMEDIUM = "Medium";
const gLARGE = "Large";
const gSEAFOOD = "Seafood";
const gHAWAII = "Hawaii";
const gBACON = "Bacon";

var gOrderData = {
    kichCo: "",
    duongKinh: "",
    suon: "",
    salad: "",
    soLuongNuoc: "",
    thanhTien: "",
    loaiPizza: "",
    hoTen: "",
    email: "",
    diaChi: "",
    soDienThoai: "",
    loiNhan: "",
    idVourcher: "",
    phanTramGiamGia: 0,
    idLoaiNuocUong: "",
    finalPrice: function() {
        return this.thanhTien * (1 - this.phanTramGiamGia / 100);
    }
};

/*** REGION 2 - Vùng gán / thực thi sự kiện cho các elements */
// gán sự kiện tải trang/F5
$(document).ready(onPageLoading);

// gán sự kiện click button chọn Combo Small
$(document).on("click", "#card-small", onBtnSmallClick);
// gán sự kiện click button chọn Combo Medium
$(document).on("click", "#card-medium", onBtnMediumClick);
// gán sự kiện click button chọn Combo Large
$(document).on("click", "#card-large", onBtnLargeClick);

// gán sự kiện click button chọn Pizza Seafood
$(document).on("click", "#card-seafood", onBtnSeafoodClick);
// gán sự kiện click button chọn Pizza Hawaii
$(document).on("click", "#card-hawaii", onBtnHawaiiClick);
// gán sự kiện click button chọn Pizza Bacon
$(document).on("click", "#card-bacon", onBtnBaconClick);

// gán sự kiện click button Send
$(document).on("click", "#btn-send", onBtnSendClick);
// gán sự kiện click button Tạo đơn hàng trên modal Send Order
$(document).on("click", "#btn-create-order", onBtnCreateOrderClick);
    
/*** REGION 3 - Event handlers - Vùng khai báo các hàm xử lý sự kiện */
// function xử lý sự kiện tải trang/F5
function onPageLoading() {
    // Gọi API lấy drink list
    let vAjaxRequest = apiGetDrinkList();
    vAjaxRequest.done(function(drinkList) {
        // Load drink list vào select
        loadDrinkListToSelect(drinkList);
    })
}

// function xử lý sự kiện click button chọn combo Small
function onBtnSmallClick() {
    console.log("%cCOMBO SELECTED", "color: orange");
    changeColorButton(gSMALL);
    getOrderData(gSMALL);
    displaySelectedCombo(gOrderData);
}

// function xử lý sự kiện click button chọn combo Medium
function onBtnMediumClick() {
    console.log("%cCOMBO SELECTED", "color: orange");
    changeColorButton(gMEDIUM);
    getOrderData(gMEDIUM);
    displaySelectedCombo(gOrderData);
}

// function xử lý sự kiện click button chọn combo Large
function onBtnLargeClick() {
    console.log("%cCOMBO SELECTED", "color: orange");
    changeColorButton(gLARGE);
    getOrderData(gLARGE);
    displaySelectedCombo(gOrderData);
}

// function xử lý sự kiện click button chọn Pizza Seafood
function onBtnSeafoodClick() {
    console.log("%cPIZZA SELECTED", "color: red");
    changeColorButton(gSEAFOOD);
    getOrderData(gSEAFOOD);
    console.log("Loại Pizza: " + gOrderData.loaiPizza);
}

// function xử lý sự kiện click button chọn Pizza Hawaii
function onBtnHawaiiClick() {
    console.log("%cPIZZA SELECTED", "color: red");
    changeColorButton(gHAWAII);
    getOrderData(gHAWAII);
    console.log("Loại Pizza: " + gOrderData.loaiPizza);
}

// function xử lý sự kiện click button chọn Pizza Bacon
function onBtnBaconClick() {
    console.log("%cPIZZA SELECTED", "color: red");
    changeColorButton(gBACON);
    getOrderData(gBACON);
    console.log("Loại Pizza: " + gOrderData.loaiPizza);
}

// function xử lý sự kiện click button Send
function onBtnSendClick(){
    // B1: Thu thập dữ liệu:
    getOrderConfirm(gOrderData);
    // B2: Kiểm tra dữ liệu:
    let vDataValid = checkOrderData(gOrderData);
    if (vDataValid) {
        // B3: Nếu user có điền voucher thì gọi API kiểm tra voucher lấy phần trăm giảm giá:
        if (gOrderData.idVourcher != "") {
            gOrderData.phanTramGiamGia = apiGetDiscoutPercent(gOrderData);
        }
        // B4: Xử lý hiển thị:
        // Hiện modal Thông tin đơn hàng
        $("#modal-send-order").modal("show");
        // Hiển thị thông tin đơn hàng lên modal
        displayOrderDataOnModal(gOrderData);
    }
}

// function xử lý sự kiện click button Tạo đơn hàng trên modal Send Order
function onBtnCreateOrderClick() {
    $("#modal-send-order").modal("hide");
    // Tạo đối tượng chứa dữ liệu tạo đơn hàng
    let vRequestObject = {
        kichCo: gOrderData.kichCo,
        duongKinh: gOrderData.duongKinh,
        suon: gOrderData.suon,
        salad: gOrderData.salad,
        loaiPizza: gOrderData.loaiPizza,
        idVourcher: gOrderData.idVourcher,
        idLoaiNuocUong: gOrderData.idLoaiNuocUong,
        soLuongNuoc: gOrderData.soLuongNuoc,
        hoTen: gOrderData.hoTen,
        thanhTien: gOrderData.thanhTien,
        email: gOrderData.email,
        soDienThoai: gOrderData.soDienThoai,
        diaChi: gOrderData.diaChi,
        loiNhan: gOrderData.loiNhan
    }
    // Gọi API tạo đơn hàng mới
    let vAjaxRequest = apiCreateNewOrder(vRequestObject);
    vAjaxRequest.done(function(response) {
        // Xử lý hiển thị
        $("#modal-order-code").modal("show");
        $("#new-order-code").val(response.orderCode);
    });
    vAjaxRequest.fail(function() {
        alert("Tạo đơn hàng không thành công. Vui lòng thử lại");
    })

}

/*** REGION 4 - Common funtions - Vùng khai báo hàm dùng chung trong toàn bộ chương trình*/
// function gọi API lấy danh sách drink
function apiGetDrinkList() {
    return $.ajax({
        url: "http://203.171.20.210:8080/devcamp-pizza365/drinks",
        type: "GET",
    });
}

// function load drink list vào select
function loadDrinkListToSelect(paramDrinkList) {
    for (let drink of paramDrinkList) {
        $("#select-drink").append(
            $("<option>").val(drink.maNuocUong).text(drink.tenNuocUong)
        );
    }
}

// function tìm voucher khách hàng nhập được lưu trong object paramOrderData
// functiont trả lại số % được giảm giá; return 0 nếu không tìm thấy voucher
function apiGetDiscoutPercent(paramOrderData) {
    let vDisCountPercent = 0;
    $.ajax({
        url: "http://203.171.20.210:8080/devcamp-pizza365/voucher_detail/" + paramOrderData.idVourcher,
        type: "GET",
        async: false,
    }).done(function(discount) {
        alert("Voucher hợp lệ. Bạn đã được giảm giá");
        vDisCountPercent = discount.phanTramGiamGia;
    }).fail(function() {
        alert("Mã giảm giá không tồn tại");
    })
    return vDisCountPercent;
}

// function gọi API tạo đơn hàng mới
function apiCreateNewOrder(paramOrderData) {
    return $.ajax({
        url: "http://203.171.20.210:8080/devcamp-pizza365/orders",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(paramOrderData)
    });
}

// function xử lý đổi màu button được click
function changeColorButton(paramButton) {
    // Xử lý đổi màu nhóm button chọn Combo
    if (paramButton == gSMALL) {
        $("#btn-small").removeClass().addClass("btn w-100 data-select");
        $("#btn-medium").removeClass().addClass("btn w-100 data-unselect");
        $("#btn-large").removeClass().addClass("btn w-100 data-unselect");
    }
    else if (paramButton == gMEDIUM) {
        $("#btn-small").removeClass().addClass("btn w-100 data-unselect");
        $("#btn-medium").removeClass().addClass("btn w-100 data-select");
        $("#btn-large").removeClass().addClass("btn w-100 data-unselect");
    }
    else if (paramButton == gLARGE) {
        $("#btn-small").removeClass().addClass("btn w-100 data-unselect");
        $("#btn-medium").removeClass().addClass("btn w-100 data-unselect");
        $("#btn-large").removeClass().addClass("btn w-100 data-select");
    }
    // Xử lý đổi màu nhóm button chọn Pizza
    if (paramButton == gSEAFOOD) {
        $("#btn-seafood").removeClass().addClass("btn w-100 data-select");
        $("#btn-hawaii").removeClass().addClass("btn w-100 data-unselect");
        $("#btn-bacon").removeClass().addClass("btn w-100 data-unselect");
    }
    else if (paramButton == gHAWAII) {
        $("#btn-seafood").removeClass().addClass("btn w-100 data-unselect");
        $("#btn-hawaii").removeClass().addClass("btn w-100 data-select");
        $("#btn-bacon").removeClass().addClass("btn w-100 data-unselect");
    }
    else if (paramButton == gBACON) {
        $("#btn-seafood").removeClass().addClass("btn w-100 data-unselect");
        $("#btn-hawaii").removeClass().addClass("btn w-100 data-unselect");
        $("#btn-bacon").removeClass().addClass("btn w-100 data-select");
    }
}

// function thu thập dữ liệu Combo và Loại Pizza
// function return thông tin order vào biến toàn cục gOrderData
function getOrderData(paramButton) {
    // Get data Combo
    if (paramButton == gSMALL) {
        gOrderData.kichCo = "S";
        gOrderData.duongKinh = 20;
        gOrderData.suon = 2;
        gOrderData.salad = 200;
        gOrderData.soLuongNuoc = 2;
        gOrderData.thanhTien = 150000;
    }
    else if (paramButton == gMEDIUM) {
        gOrderData.kichCo = "M";
        gOrderData.duongKinh = 25;
        gOrderData.suon = 4;
        gOrderData.salad = 300;
        gOrderData.soLuongNuoc = 3;
        gOrderData.thanhTien = 200000;
    }
    else if (paramButton == gLARGE) {
        gOrderData.kichCo = "L";
        gOrderData.duongKinh = 30;
        gOrderData.suon = 8;
        gOrderData.salad = 500;
        gOrderData.soLuongNuoc = 4;
        gOrderData.thanhTien = 250000;
    }
    // Get data Pizza
    if (paramButton == gSEAFOOD) {
        gOrderData.loaiPizza = "SEAFOOD";
    }
    else if (paramButton == gHAWAII) {
        gOrderData.loaiPizza = "HAWAII";
    }
    else if (paramButton == gBACON) {
        gOrderData.loaiPizza = "BACON";
    }
}

// function xử lý hiển thị combo lên console
function displaySelectedCombo(paramOrder) {
    console.log("Loại Combo: " + paramOrder.kichCo);
    console.log("Đường kính: " + paramOrder.duongKinh + "cm");
    console.log("Sườn nướng: " + paramOrder.suon);
    console.log("Salad: " + paramOrder.salad + "g");
    console.log("Nước ngọt: " + paramOrder.soLuongNuoc);
    console.log("Giá bán (VND): " + paramOrder.thanhTien);
}

// function kiểm tra email
// function return true nếu tất cả thông tin hợp lệ. Return false nếu có thông tin không hợp lệ
function checkEmail(paramOrderData) {
    var vCharBefore = paramOrderData.email.split("@")[0];
    var vCharAfter = paramOrderData.email.split("@")[1];
    if (paramOrderData.email == "") {
        alert("Vui lòng nhập email");
        return false;
    }
    else if (!paramOrderData.email.includes("@")) {
        alert("Email phải có @");
        return false;
    }
    else if (vCharBefore == "" || vCharAfter == "") {
        alert("Email phải có kí tự trước và sau @");
        return false;
    }
    return true;
}

// function thu thập dữ liệu người dùng nhập trên form
// function return thông tin order người dùng nhập lưu vào biến toàn cục gOrderData
function getOrderConfirm(paramOrderData) {
    paramOrderData.hoTen = $("#inp-fullname").val().trim();
    paramOrderData.email = $("#inp-email").val().trim();
    paramOrderData.soDienThoai = $("#inp-phone").val().trim();
    paramOrderData.diaChi = $("#inp-address").val().trim();
    paramOrderData.idVourcher = $("#inp-voucher-id").val().trim();
    paramOrderData.loiNhan = $("#inp-message").val().trim();
    paramOrderData.idLoaiNuocUong = $("#select-drink").val().trim();
}

// function kiểm tra dữ liệu trên form
// function return true nếu tất cả thông tin hợp lệ. Return false nếu có thông tin không hợp lệ
function checkOrderData(paramOrderData) {
    // kiểm tra menu
    if (paramOrderData.kichCo == "") {
        alert("Vui lòng chọn Menu Combo");
        return false;
    }
    // kiểm tra loại pizza
    else if (paramOrderData.loaiPizza == "") {
        alert("Vui lòng chọn Loại Pizza");
        return false;
    }
    else if (paramOrderData.idLoaiNuocUong == "none") {
        alert("Vui lòng chọn thức uống");
        return false;
    }
    else if (paramOrderData.hoTen == "") {
        alert("Vui lòng nhập họ và tên");
        return false;
    }
    else if (!checkEmail(paramOrderData)) {
        return false;
    }
    else if (paramOrderData.soDienThoai == "") {
        alert("Vui lòng nhập số điện thoại");
        return false;
    }
    else if (paramOrderData.diaChi == "") {
        alert("Vui lòng nhập địa chỉ");
        return false;
    }
    return true;
}

// function hiển thị thông tin order lên form Modal Send Order
function displayOrderDataOnModal(paramOrderData) {
    $("#modal-send-fullname").val(paramOrderData.hoTen);
    $("#modal-send-email").val(paramOrderData.email);
    $("#modal-send-phone").val(paramOrderData.soDienThoai);
    $("#modal-send-address").val(paramOrderData.diaChi);
    $("#modal-send-voucher-id").val(paramOrderData.idVourcher);
    $("#modal-send-message").val(paramOrderData.loiNhan);
    // Tổng hợp thông tin đơn hàng:
    let vOrderSummary = 
        "Combo Pizza: " + paramOrderData.kichCo +
        "&#10;Đường kính: " + paramOrderData.duongKinh + "cm" +
        "&#10;Sườn nướng: " + paramOrderData.suon +
        "&#10;Salad: " + paramOrderData.salad + "g" +
        "&#10;Nước ngọt: " + paramOrderData.soLuongNuoc +
        "&#10;*****************" +
        "&#10;Loại Pizza: " + paramOrderData.loaiPizza +
        "&#10;Đồ uống: " + paramOrderData.idLoaiNuocUong +
        "&#10;Mã Voucher: " + paramOrderData.idVourcher +
        "&#10;Giá: VNĐ " + paramOrderData.thanhTien +
        "&#10;Giảm giá: " + paramOrderData.phanTramGiamGia + "%" +
        "&#10;Phải thanh toán: VNĐ " + paramOrderData.finalPrice();
    // hiển thị vào ô textarea
    $("#modal-send-order-info").html(vOrderSummary);
}