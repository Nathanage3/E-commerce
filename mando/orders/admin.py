from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    autocomplete_fields = ['course']
    min_num = 1
    max_num = 10
    model = OrderItem
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    autocomplete_fields = ['customer']
    inlines = [OrderItemInline]
    list_display = ['id', 'placed_at', 'customer']
