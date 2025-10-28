import React, { useState } from 'react';
import { useCarouselForm } from './useCarouselForm'; 
import type { CarouselResponseType } from './carousel.types'; 

// Ajuste os caminhos de importação do seu useCarouselForm e tipos conforme a estrutura real
// O código abaixo assume que os tipos e o hook estão acessíveis.

// --- Componente de Linha (Implementa a lógica Edit/Save/Remove) ---
const CarouselItemRow: React.FC<{ 
    item: CarouselResponseType, 
    updateField: (id: string, field: keyof CarouselResponseType, value: any) => void,
    handleSaveItem: (item: CarouselResponseType) => Promise<{ success: boolean, message: string }>,
    handleDeactivateItem: (item: CarouselResponseType) => Promise<{ success: boolean, message: string }>,
    isSaving: boolean, 
}> = ({ item, updateField, handleSaveItem, handleDeactivateItem, isSaving }) => {

    const [isEditing, setIsEditing] = useState(false);
    const [rowFeedback, setRowFeedback] = useState('');
    const [isRowSaving, setIsRowSaving] = useState(false);

    const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numValue = value === "" ? undefined : parseInt(value, 10);
        updateField(item._id, 'orderCarousel', numValue);
        setRowFeedback('');
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateField(item._id, 'extraURL', e.target.value);
        setRowFeedback('');
    };

    const saveCurrentItem = async () => {
        setIsRowSaving(true);
        setRowFeedback('');

        const result = await handleSaveItem(item);

        setRowFeedback(result.message);
        setIsRowSaving(false);

        if (result.success) {
            setIsEditing(false);
        }

        setTimeout(() => setRowFeedback(''), 4000);
    };

    const removeCurrentItem = async () => {
        if (!window.confirm(`Tem certeza que deseja REMOVER "${item.title}" do carrossel?`)) return;

        setIsRowSaving(true);
        setRowFeedback('');

        const result = await handleDeactivateItem(item);

        setIsRowSaving(false);
        setRowFeedback(result.message);

        setTimeout(() => setRowFeedback(''), 4000);
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setRowFeedback('');
    };

    const typeColor = item.collection_type === 'project' ? 'text-blue-600' : 'text-green-600';
    const isOrdered = item.orderCarousel !== undefined && item.orderCarousel !== null && item.orderCarousel >= 0;
    const feedbackStyle = rowFeedback.includes('Erro') ? 'text-red-500' : 'text-green-600';


    return (
        <tr className={`border-b hover:bg-gray-50 ${isOrdered ? 'bg-white' : 'bg-yellow-50/50'} ${isEditing ? 'border-2 border-indigo-400' : ''}`}>

            {/* Coluna de Título/Tipo */}
            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {item.title}
                <span className={`ml-2 text-xs font-semibold ${typeColor}`}>
                    [{item.collection_type.toUpperCase()}]
                </span>
            </td>

            {/* Coluna da Ordem (Input Numérico) */}
            <td className="px-6 py-4">
                <input
                    type="number"
                    min="0"
                    value={item.orderCarousel === undefined || item.orderCarousel === null ? "" : item.orderCarousel}
                    onChange={handleOrderChange}
                    disabled={!isEditing || isRowSaving}
                    className="w-20 p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Sem ordem"
                />
                {!isOrdered && <p className="text-xs text-red-500 mt-1">Item **inativo**</p>}
            </td>

            {/* Coluna da URL Extra */}
            <td className="px-6 py-4">
                <input
                    type="url"
                    value={item.extraURL || ""}
                    onChange={handleUrlChange}
                    disabled={!isEditing || isRowSaving}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    placeholder="URL Opcional"
                />
            </td>

            {/* Coluna de AÇÃO E FEEDBACK */}
            <td className="px-6 py-4 text-center">
                {!isEditing ? (
                    // MODO VISUALIZAÇÃO: Botões EDITAR e REMOVER
                    <div className="space-y-1">
                        <button
                            onClick={() => setIsEditing(true)}
                            disabled={isSaving}
                            className={`p-2 rounded text-white text-xs font-bold transition-colors w-24 bg-yellow-600 hover:bg-yellow-700`}
                        >
                            Editar
                        </button>
                        <button
                            onClick={removeCurrentItem}
                            disabled={isSaving}
                            className={`p-2 rounded text-xs transition-colors w-24 bg-red-600 text-white hover:bg-red-700`}
                        >
                            Remover Destaque
                        </button>
                    </div>
                ) : (
                    // MODO EDIÇÃO: Botões SALVAR / CANCELAR
                    <div className="space-y-1">
                        <button
                            onClick={saveCurrentItem}
                            disabled={isRowSaving || isSaving}
                            className={`p-2 rounded text-white text-xs font-bold transition-colors w-24
                                ${isRowSaving || isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                        >
                            {isRowSaving ? 'Salvando...' : 'Salvar'}
                        </button>
                        <button
                            onClick={cancelEdit}
                            disabled={isRowSaving || isSaving}
                            className={`p-2 rounded text-xs transition-colors w-24 bg-gray-200 text-gray-700 hover:bg-gray-300`}
                        >
                            Cancelar
                        </button>
                    </div>
                )}
                
                {rowFeedback && (
                    <p className={`mt-1 text-xs font-medium ${feedbackStyle}`}>
                        {rowFeedback}
                    </p>
                )}
            </td>
        </tr>
    );
};


export const FormCarouselHighlights: React.FC = () => {
    const { state, actions } = useCarouselForm();
    const { highlightItems, isLoading, error, isSaving, inactiveItems } = state;

    // Desestruturação correta
    const { handleSaveItem, updateItemField, handleDeactivateItem } = actions; 

    // NOVO ESTADO: Controla a seleção do item inativo a ser adicionado
    const [selectedInactiveId, setSelectedInactiveId] = useState('');
    const selectedItem = inactiveItems.find(item => item._id === selectedInactiveId);

    const sortedItems = highlightItems;

    if (isLoading && highlightItems.length === 0) {
        return <div className="text-center py-8 text-gray-400">Carregando itens do carrossel...</div>;
    }

    if (error && highlightItems.length === 0) {
        return <div className="p-6 bg-white shadow-lg rounded-lg text-red-600 text-center py-8">
            Falha crítica ao carregar destaques. Verifique o console e a API.
        </div>;
    }
    
    // Se não há itens para gerenciar
    if (highlightItems.length === 0 && !isLoading && !error) {
         return (
            <div className="p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold mb-6">✨ Gestão de Destaques do Carrossel</h2>
                <p className="text-gray-600 p-4 border rounded">Não há itens marcados como candidatos ao carrossel. Por favor, use a opção 'Adicionar Novo Item' no menu superior.</p>
            </div>
        );
    }


    return (
        <div className="p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-6">✨ Gestão de Destaques do Carrossel</h2>
            
            {/* 1. Mensagem de Erro (Se a lista carregou, mas há um erro de fundo) */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    Atenção: Houve um erro de API, a lista pode estar incompleta.
                </div>
            )}

            <div className="flex justify-between items-center mb-4">
                <p className="text-gray-600">
                    Clique em **Editar** para desbloquear os campos e salvar item por item.
                </p>
            </div>

            <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Item (Projeto/Perspectiva)</th>
                            <th scope="col" className="px-6 py-3">Ordem (0, 1, 2...)</th>
                            <th scope="col" className="px-6 py-3">URL Extra</th>
                            <th scope="col" className="px-6 py-3 text-center">Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedItems.map(item => (
                            <CarouselItemRow
                                key={item._id}
                                item={item}
                                updateField={updateItemField}
                                handleSaveItem={handleSaveItem}
                                handleDeactivateItem={handleDeactivateItem} // NOVO PROP
                                isSaving={isSaving}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};