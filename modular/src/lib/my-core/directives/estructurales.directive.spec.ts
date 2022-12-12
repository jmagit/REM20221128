import { CommonModule } from '@angular/common';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UnlessDirective } from './estructurales.directive';

@Component({
  template: `<button type="button" [myUnless]="MyInput"  ></button>`
})
class UnlessDirectiveHostComponent {
  MyInput: any = null;
}

// eslint-disable-next-line @angular-eslint/component-selector
@Component({ selector: 'test-cmp', template: '' })
class TestComponent {
  booleanCondition = true;
  nestedBooleanCondition = true;
  numberCondition = 1;
  stringCondition = 'foo';
  functionCondition = (s: any, n: any): boolean => s == 'foo' && n == 1;
}

function createTestComponent(template: string): ComponentFixture<TestComponent> {
  return TestBed.overrideComponent(TestComponent, { set: { template: template } })
    .createComponent(TestComponent);
}

describe('UnlessDirective', () => {
  let fixture: ComponentFixture<any>;

  function getComponent(): TestComponent {
    return fixture.componentInstance;
  }

  afterEach(() => {
    fixture = null!;
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, UnlessDirective],
    });
  });

  it('attribute: true', waitForAsync(() => {
    const template = '<span *myUnless="booleanCondition">hello word</span>';
    fixture = createTestComponent(template);
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('span')).length).toEqual(0);
  }));

  it('attribute: false', waitForAsync(() => {
    const template = '<span *myUnless="booleanCondition">hello word</span>';
    fixture = createTestComponent(template);
    getComponent().booleanCondition = false;
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('span')).length).toEqual(1);
  }));

})
