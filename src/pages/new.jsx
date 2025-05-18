import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orders } from '../data/orders';
import { models } from '../data/models';

const SearchPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('orders');
    const navigate = useNavigate();

    const filteredOrders = orders.filter(order =>
        order.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredModels = models.filter(model =>
        model.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Введите поисковый запрос..."
                    className="w-full p-2 border rounded mb-2"
                />
                <button
                    onClick={() => setSearchQuery(searchQuery)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Найти
                </button>
            </div>

            <div className="flex gap-4 mb-4">
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`px-4 py-2 rounded ${activeTab === 'orders' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}
                >
                    Заказы
                </button>
                <button
                    onClick={() => setActiveTab('models')}
                    className={`px-4 py-2 rounded ${activeTab === 'models' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}
                >
                    Модели
                </button>
            </div>

            {activeTab === 'orders' ? (
                <div>
                    {filteredOrders.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="border rounded p-4 cursor-pointer hover:shadow-lg"
                                    onClick={() => navigate(`/orders/${order.id}`)}
                                >
                                    <h3 className="text-lg font-semibold">{order.title}</h3>
                                    <p className="text-gray-600">{order.description}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">Заказов не найдено</p>
                    )}
                </div>
            ) : (
                <div>
                    {filteredModels.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredModels.map((model) => (
                                <div
                                    key={model.id}
                                    className="border rounded p-4 cursor-pointer hover:shadow-lg"
                                    onClick={() => navigate(`/models/${model.id}`)}
                                >
                                    <h3 className="text-lg font-semibold">{model.title}</h3>
                                    <p className="text-gray-600">{model.description}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">Моделей не найдено</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchPage; 