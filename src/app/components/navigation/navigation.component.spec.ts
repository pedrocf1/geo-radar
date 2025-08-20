import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { NavigationComponent, ViewType } from './navigation.component';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.activeView).toBe('map');
      expect(component.viewChange).toBeDefined();
    });

    it('should have map as default active view', () => {
      fixture.detectChanges();
      
      const mapButton = fixture.debugElement.query(By.css('button[class*="active"]'));
      expect(mapButton.nativeElement.textContent.trim()).toContain('Weather Map');
    });
  });

  describe('Template Rendering', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should render navigation brand', () => {
      const brandElement = fixture.debugElement.query(By.css('.nav-brand h1'));
      expect(brandElement.nativeElement.textContent).toContain('🌤️ Geo Radar');
    });

    it('should render navigation subtitle', () => {
      const subtitleElement = fixture.debugElement.query(By.css('.nav-brand p'));
      expect(subtitleElement.nativeElement.textContent).toBe('Netherlands Weather Dashboard');
    });

    it('should render both navigation buttons', () => {
      const buttons = fixture.debugElement.queryAll(By.css('.nav-button'));
      expect(buttons.length).toBe(2);
      
      expect(buttons[0].nativeElement.textContent.trim()).toContain('Weather Map');
      expect(buttons[1].nativeElement.textContent.trim()).toContain('Forecast');
    });

    it('should render data source info', () => {
      const infoElement = fixture.debugElement.query(By.css('.nav-info small'));
      expect(infoElement.nativeElement.textContent).toBe('Data from Buienradar.nl');
    });

    it('should render correct button icons', () => {
      const buttons = fixture.debugElement.queryAll(By.css('.nav-button'));
      
      expect(buttons[0].nativeElement.textContent).toContain('🗺️');
      expect(buttons[1].nativeElement.textContent).toContain('📊');
    });
  });

  describe('Active View States', () => {
    it('should mark map button as active when activeView is map', () => {
      component.activeView = 'map';
      fixture.detectChanges();
      
      const mapButton = fixture.debugElement.query(By.css('button:first-of-type'));
      const forecastButton = fixture.debugElement.query(By.css('button:last-of-type'));
      
      expect(mapButton.nativeElement.classList).toContain('active');
      expect(forecastButton.nativeElement.classList).not.toContain('active');
    });

    it('should mark forecast button as active when activeView is forecast', () => {
      component.activeView = 'forecast';
      fixture.detectChanges();
      
      const mapButton = fixture.debugElement.query(By.css('button:first-of-type'));
      const forecastButton = fixture.debugElement.query(By.css('button:last-of-type'));
      
      expect(mapButton.nativeElement.classList).not.toContain('active');
      expect(forecastButton.nativeElement.classList).toContain('active');
    });

    it('should update active state when activeView input changes', () => {
      component.activeView = 'map';
      fixture.detectChanges();
      
      let activeButton = fixture.debugElement.query(By.css('button.active'));
      expect(activeButton.nativeElement.textContent).toContain('Weather Map');
      
      component.activeView = 'forecast';
      fixture.detectChanges();
      
      activeButton = fixture.debugElement.query(By.css('button.active'));
      expect(activeButton.nativeElement.textContent).toContain('Forecast');
    });
  });

  describe('User Interactions', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should emit viewChange when map button is clicked', () => {
      spyOn(component.viewChange, 'emit');
      
      const mapButton = fixture.debugElement.query(By.css('button:first-of-type'));
      mapButton.nativeElement.click();
      
      expect(component.viewChange.emit).toHaveBeenCalledWith('map');
    });

    it('should emit viewChange when forecast button is clicked', () => {
      spyOn(component.viewChange, 'emit');
      
      const forecastButton = fixture.debugElement.query(By.css('button:last-of-type'));
      forecastButton.nativeElement.click();
      
      expect(component.viewChange.emit).toHaveBeenCalledWith('forecast');
    });

    it('should call switchView method when buttons are clicked', () => {
      spyOn(component, 'switchView');
      
      const mapButton = fixture.debugElement.query(By.css('button:first-of-type'));
      const forecastButton = fixture.debugElement.query(By.css('button:last-of-type'));
      
      mapButton.nativeElement.click();
      expect(component.switchView).toHaveBeenCalledWith('map');
      
      forecastButton.nativeElement.click();
      expect(component.switchView).toHaveBeenCalledWith('forecast');
    });

    it('should handle multiple rapid clicks', () => {
      spyOn(component.viewChange, 'emit');
      
      const mapButton = fixture.debugElement.query(By.css('button:first-of-type'));
      
      mapButton.nativeElement.click();
      mapButton.nativeElement.click();
      mapButton.nativeElement.click();
      
      expect(component.viewChange.emit).toHaveBeenCalledTimes(3);
      expect(component.viewChange.emit).toHaveBeenCalledWith('map');
    });
  });

  describe('switchView Method', () => {
    it('should emit the correct view type when called with map', () => {
      spyOn(component.viewChange, 'emit');
      
      component.switchView('map');
      
      expect(component.viewChange.emit).toHaveBeenCalledWith('map');
      expect(component.viewChange.emit).toHaveBeenCalledTimes(1);
    });

    it('should emit the correct view type when called with forecast', () => {
      spyOn(component.viewChange, 'emit');
      
      component.switchView('forecast');
      
      expect(component.viewChange.emit).toHaveBeenCalledWith('forecast');
      expect(component.viewChange.emit).toHaveBeenCalledTimes(1);
    });

    it('should work with different ViewType values', () => {
      spyOn(component.viewChange, 'emit');
      
      const viewTypes: ViewType[] = ['map', 'forecast'];
      
      viewTypes.forEach(viewType => {
        component.switchView(viewType);
        expect(component.viewChange.emit).toHaveBeenCalledWith(viewType);
      });
      
      expect(component.viewChange.emit).toHaveBeenCalledTimes(2);
    });
  });

  describe('Input/Output Binding', () => {
    it('should accept activeView input', () => {
      const testView: ViewType = 'forecast';
      component.activeView = testView;
      
      expect(component.activeView).toBe(testView);
    });

    it('should have viewChange output emitter', () => {
      expect(component.viewChange).toBeDefined();
      expect(component.viewChange.subscribe).toBeDefined();
    });

    it('should emit events that can be subscribed to', () => {
      let emittedValue: ViewType | undefined;
      
      component.viewChange.subscribe((value: ViewType) => {
        emittedValue = value;
      });
      
      component.switchView('forecast');
      
      expect(emittedValue).toBe('forecast');
    });
  });

  describe('Component Structure', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should have proper navigation structure', () => {
      const navElement = fixture.debugElement.query(By.css('nav.navigation'));
      expect(navElement).toBeTruthy();
      
      const containerElement = fixture.debugElement.query(By.css('.nav-container'));
      expect(containerElement).toBeTruthy();
    });

    it('should have all required sections', () => {
      const brandSection = fixture.debugElement.query(By.css('.nav-brand'));
      const buttonsSection = fixture.debugElement.query(By.css('.nav-buttons'));
      const infoSection = fixture.debugElement.query(By.css('.nav-info'));
      
      expect(brandSection).toBeTruthy();
      expect(buttonsSection).toBeTruthy();
      expect(infoSection).toBeTruthy();
    });

    it('should have correct button attributes', () => {
      const buttons = fixture.debugElement.queryAll(By.css('.nav-button'));
      
      buttons.forEach(button => {
        expect(button.nativeElement.tagName).toBe('BUTTON');
        expect(button.nativeElement.classList).toContain('nav-button');
      });
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should have proper button semantics', () => {
      const buttons = fixture.debugElement.queryAll(By.css('button'));
      
      buttons.forEach(button => {
        expect(button.nativeElement.tagName).toBe('BUTTON');
        expect(button.nativeElement.textContent.trim().length).toBeGreaterThan(0);
      });
    });

    it('should support keyboard navigation', () => {
      const buttons = fixture.debugElement.queryAll(By.css('button'));
      
      buttons.forEach(button => {
        expect(button.nativeElement.tabIndex).not.toBe(-1);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined activeView gracefully', () => {
      component.activeView = undefined as any;
      fixture.detectChanges();
      
      const activeButtons = fixture.debugElement.queryAll(By.css('button.active'));
      expect(activeButtons.length).toBe(0);
    });

    it('should handle invalid ViewType gracefully', () => {
      spyOn(component.viewChange, 'emit');
      
      component.switchView('invalid' as ViewType);
      
      expect(component.viewChange.emit).toHaveBeenCalledWith('invalid' as ViewType);
    });

    it('should work with null activeView', () => {
      component.activeView = null as any;
      fixture.detectChanges();
      
      expect(() => fixture.detectChanges()).not.toThrow();
    });
  });

  describe('Event Propagation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should properly handle click events', () => {
      spyOn(component, 'switchView');
      
      const mapButton = fixture.debugElement.query(By.css('button:first-of-type'));
      const clickEvent = new Event('click');
      
      mapButton.nativeElement.dispatchEvent(clickEvent);
      
      expect(component.switchView).toHaveBeenCalledWith('map');
    });

    it('should handle programmatic clicks', () => {
      spyOn(component.viewChange, 'emit');
      
      const forecastButton = fixture.debugElement.query(By.css('button:last-of-type'));
      forecastButton.triggerEventHandler('click', null);
      
      expect(component.viewChange.emit).toHaveBeenCalledWith('forecast');
    });
  });
});
