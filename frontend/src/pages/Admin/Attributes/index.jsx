
const Attributes = () => {
    return (
        <div className="mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 h-[100rem]">
                <div>
                    <a href="/admin/functionList" className="block w-full h-full">
                        <button className="bg-gradient-to-br from-green-400 to-blue-600 w-full h-full text-white font-semibold hover:bg-gradient-to-bl focus:ring-4 focus:ring-green-200 rounded-md">
                            Tính năng sử dụng
                        </button>
                    </a>
                </div>
                <div>
                    <a href="/admin/styleList" className="block w-full h-full">
                        <button className="bg-gradient-to-br from-green-400 to-blue-600 w-full h-full text-white font-semibold hover:bg-gradient-to-bl focus:ring-4 focus:ring-green-200 rounded-md">
                            Phong cách
                        </button>
                    </a>
                </div>
                <div>
                    <a href="/admin/woodTypeList" className="block w-full h-full">
                        <button className="bg-gradient-to-br from-green-400 to-blue-600 w-full h-full text-white font-semibold hover:bg-gradient-to-bl focus:ring-4 focus:ring-green-200 rounded-md">
                            Loại gỗ
                        </button>
                    </a>
                </div>
                <div>
                    <a href="/admin/locationList" className="block w-full h-full">
                        <button className="bg-gradient-to-br from-green-400 to-blue-600 w-full h-full text-white font-semibold hover:bg-gradient-to-bl focus:ring-4 focus:ring-green-200 rounded-md">
                            Địa điểm sử dụng
                        </button>
                    </a>
                </div>
                <div>
                    <a href="/admin/craftingTechniqueList" className="block w-full h-full">
                        <button className="bg-gradient-to-br from-green-400 to-blue-600 w-full h-full text-white font-semibold hover:bg-gradient-to-bl focus:ring-4 focus:ring-green-200 rounded-md">
                            Kỹ thuật chế tạo
                        </button>
                    </a>
                </div>
                <div>
                <a href="/admin/priceRangeList" className="block w-full h-full">
                    <button className="bg-gradient-to-br from-green-400 to-blue-600 w-full h-full text-white font-semibold hover:bg-gradient-to-bl focus:ring-4 focus:ring-green-200 rounded-md">
                        Phạm vi giá
                    </button>
                </a>
                </div>
                <div>
                    <a href="/admin/furnitureTypeList" className="block w-full h-full">
                        <button className="bg-gradient-to-br from-green-400 to-blue-600 w-full h-full text-white font-semibold hover:bg-gradient-to-bl focus:ring-4 focus:ring-green-200 rounded-md">
                            Loại đồ nội thất
                        </button>
                    </a>
                </div>
                <div>
                    <a href="/admin/categoryList" className="block w-full h-full">
                        <button className="bg-gradient-to-br from-green-400 to-blue-600 w-full h-full text-white font-semibold hover:bg-gradient-to-bl focus:ring-4 focus:ring-green-200 rounded-md">
                            Thể loại
                        </button>
                    </a>
                </div>
                <div>
                    <a href="/admin/materialList" className="block w-full h-full">
                        <button className="bg-gradient-to-br from-green-400 to-blue-600 w-full h-full text-white font-semibold hover:bg-gradient-to-bl focus:ring-4 focus:ring-green-200 rounded-md">
                            Nguyên liệu
                        </button>
                    </a>
                </div>
                <div>
                    <a href="/admin/productColorList" className="block w-full h-full">
                        <button className="bg-gradient-to-br from-green-400 to-blue-600 w-full h-full text-white font-semibold hover:bg-gradient-to-bl focus:ring-4 focus:ring-green-200 rounded-md">
                            Màu sắc sản phẩm
                        </button>
                    </a>
                </div>
            </div>
        </div>
    )
};

export default Attributes;