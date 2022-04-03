import games from '../test-data'
import {LitElement, html} from 'lit';
import FontAwesomeStyle from '../../fontawesome/css/all.css';
import PageContainerStyle from '../../scss/litElements/page-container.scss';
import GameElementStyle from '../../scss/litElements/game-element.scss';
import SortElementStyle from '../../scss/litElements/sort-element.scss';

class PageContainer extends LitElement {

	constructor() {
		super();
		this.games = Object.entries(games);
		this.mainUrl = 'https://www.lottoland.com';
		this.orderBy = null;
	}

	static get styles() {
		return [PageContainerStyle,GameElementStyle, SortElementStyle, FontAwesomeStyle];
	}

	sortmenuTemplate(){
		return html`
			<sort-menu>
				<div class="sort_menu__container">
					<div class="sort_menu__content">
						<div class="sort_menu__label" @click="${this.toggleSortMenu}">
							<i class="fa-solid fa-angle-down sort-icon" id="sortIcon"></i>
							<span>Sort games</span>
						</div>
						<div class="sort_menu__items hide" id="sortMenu">
							<div class="sort_menu__item">
								<div class="sort_menu__item__icon" id="sortByName" @click="${(e) => { this.sortElements('sortByName'); }}"></div>
								<div class="sort_menu__item__name">Name (A-Z)</div>
							</div>
							<div class="sort_menu__item">
								<div class="sort_menu__item__icon" id="sortByStakeToMax" @click="${(e) => { this.sortElements('sortByStakeToMax'); }}"></div>
								<div class="sort_menu__item__name">Stake (min to max)</div>
							</div>
							<div class="sort_menu__item">
								<div class="sort_menu__item__icon" id="sortByStakeToMin" @click="${(e) => { this.sortElements('sortByStakeToMin'); }}"></div>
								<div class="sort_menu__item__name">Stake (max to min)</div>
							</div>
						</div>
					</div>
				</div>
			</sort-menu>
		`
	}

	gamesTemplate(){
		return html`
			<games-container>
			${this.games.map( (item) => html`
				<game-element>
					<div class="game-element__image__container">
						<i class="fa-solid fa-info info-icon"></i>
						<img class="game-element__img" src="${this.mainUrl+item[1].image}"/>
					</div>
					<div class="game-element__info">
						<div class="game-element__info--provider">${item[1].provider}</div>
						<div class="game-element__info--name">${item[1].displayName}</div>
						<div class="game-element__info--minstake">€${item[1].currencyData.hasOwnProperty('EUR') && item[1].currencyData.EUR.hasOwnProperty('minimumStake') ? item[1].currencyData.EUR.minimumStake : 'Unknown'} min. Stake</div>
					</div>
					<a class="game-element__button" href="${this.mainUrl+item[1].playURL}">PLAY</a>
				</game-element>`
			)}
			</games-container>
		`;
	}

	toggleSortMenu(){
		var sortIcon = this.shadowRoot.getElementById('sortIcon');
		var sortMenu = this.shadowRoot.getElementById('sortMenu');
		// Show menu
		if(sortIcon.classList.contains('fa-angle-down')){
			sortIcon.classList.remove('fa-angle-down');
			sortIcon.classList.add('fa-angle-up');
			sortMenu.classList.remove('hide');

		// Hide menu
		}else if(sortIcon.classList.contains('fa-angle-up')){
			sortIcon.classList.remove('fa-angle-up');
			sortIcon.classList.add('fa-angle-down');
			sortMenu.classList.add('hide');
		}
	}

	sortElements(sortby){
		var selectedItem = this.shadowRoot.getElementById(sortby);
		var items = this.shadowRoot.querySelectorAll('.sort_menu__item__icon');
		Array.prototype.forEach.call(items, function(e){
			if(e.id != sortby){
				e.classList.remove('selected');
			}
		});
		if(!selectedItem.classList.contains('selected')){
			selectedItem.classList.add('selected');
		}
		this.orderBy = sortby;
		this.updateGamesOrder();
	}

	updateGamesOrder(){
		if(this.orderBy == 'sortByName'){
			this.games = this.games.sort(function(item1, item2){
				if(item1[0].toLowerCase() < item2[0].toLowerCase()) return -1;
				if(item1[0].toLowerCase() > item2[0].toLowerCase()) return 1;
				return 0;
			});

		}else if(this.orderBy == 'sortByStakeToMax'){
			this.games = this.games.sort(function(item1, item2){
				if( (item1[1].currencyData.hasOwnProperty('EUR') && item1[1].currencyData.EUR.hasOwnProperty('minimumStake')) && 
						(item2[1].currencyData.hasOwnProperty('EUR') && item2[1].currencyData.EUR.hasOwnProperty('minimumStake')) ){
						return parseFloat(item1[1].currencyData.EUR.minimumStake) - parseFloat(item2[1].currencyData.EUR.minimumStake);
				}
			})

		}else if(this.orderBy == 'sortByStakeToMin'){
			this.games = this.games.sort(function(item1, item2){
				if( (item1[1].currencyData.hasOwnProperty('EUR') && item1[1].currencyData.EUR.hasOwnProperty('minimumStake')) && 
						(item2[1].currencyData.hasOwnProperty('EUR') && item2[1].currencyData.EUR.hasOwnProperty('minimumStake')) ){
						return parseFloat(item2[1].currencyData.EUR.minimumStake) - parseFloat(item1[1].currencyData.EUR.minimumStake);
				}
			})

		}
		this.requestUpdate();
	}

	render(){
		return html`
			<h1>Lottoland Games</h1>
			${this.sortmenuTemplate()}
			${this.gamesTemplate()}
		`;
	}

}
customElements.define('page-container', PageContainer);