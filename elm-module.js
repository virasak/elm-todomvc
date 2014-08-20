(function (ng, Elm) {

   ng.module('Elm', [])
       .directive('elm', function ($parse) {
           function link(scope, element, attrs) {
             var id         = attrs.id;
             var target     = element[0];
             var portsIn    = $parse(attrs.portsIn)(scope);
             var moduleName = attrs.module;
             var module     = Elm[moduleName];
             var elm;

             if (target.nodeName === 'BODY') {
                 elm = Elm.fullscreen(module, portsIn)
             } else if (target.nodeName === 'ELM') {
                 elm = Elm.worker(module, portsIn);
             } else if (target.nodeName === 'DIV') {
                 elm = Elm.embed(module, target, portsIn );
             }

             if (elm) {
                 ng.forEach(elm.ports, function (port, portName) {
                     if (port.send) {
                         var send = function (event, value) {
                             console.log('on', event.name, 'with', value);
                             port.send(value);
                         };

                         scope.$on(eventName(moduleName, portName), send);
                         if (id) {
                             scope.$on(eventName(moduleName, portName + '#' + id), send);
                         }
                     } else if (port.subscribe) {
                         port.subscribe(function (value) {
                             console.log('emit', eventName(moduleName, portName), 'with', value);
                             scope.$emit(eventName(moduleName, portName), value);
                         });
                     }
                 });
             }
           };

           return {
             restrict: 'EA',
             link: link
           };
       })
    ;
    var eventName = function (moduleName, portName) {
       return 'Elm.' + moduleName + '.ports.' + portName;
    };

 })(angular, Elm);

