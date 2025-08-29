"use client";

import ZInputText from '@/components/input/input';
import './product_filter.css'
import { ZButton } from '@/components/button/button';
import ZIconField from '@/components/icon_field/icon_field';
import ZInputIcon from '@/components/input_icon/input_icon';

interface ProductFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  sortBy: string;
  categories: string[];
}

export function ProductFilters({
  searchTerm,
  selectedCategory,
  sortBy,
  categories,
}: ProductFiltersProps) {
  return (
    <div className="filters-container">
      <div className="filters-content">
        <div className="filters-wrapper">
          {/* Search */}
          <div className="search-box">
            <ZIconField iconPosition="left">
              <ZInputIcon className='pi pi-search'  />
              <ZInputText placeholder="Pesquisar" />
            </ZIconField>
            {/* <div className="p-inputgroup flex-1 align-items-center">
              <ZButton icon="pi pi-search" className="p-button-warning" />
            </div> */}
          </div>

          {/* Filters */}
          <div className="filters-right">
            <div className="filters-label">
              <div className="pi pi-filter" />
              <span>Filtros:</span>
            </div>

            <select
              value={selectedCategory}
              // onChange={(e) => onCategoryChange(e.target.value)}
              className="filters-select"
            >
              <option value="all">Todas</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              // onChange={(e) => onSortChange(e.target.value)}
              className="filters-select"
            >
              <option value="name">Nome</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
